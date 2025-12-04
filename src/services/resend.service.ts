/**
 * Resend Email Service
 * Handles sending emails via Resend API
 */

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface ResendResponse {
  id: string;
}

export class ResendService {
  private defaultFrom: string = 'Retirement Ready Vault <noreply@mail.ai-focus.org>';

  constructor() {
    // API key is now handled server-side via Vercel API route
    // No need to check for it here
  }

  async sendEmail(options: SendEmailOptions): Promise<ResendResponse> {
    const { to, subject, html, from = this.defaultFrom } = options;

    try {
      // Use our Vercel API route instead of calling Resend directly
      // This avoids CORS issues and keeps the API key server-side
      // For local dev: Use vercel dev to run API routes, or test on production
      const apiUrl = import.meta.dev 
        ? 'http://localhost:3000' // When using vercel dev
        : (import.meta.env.VITE_APP_URL || window.location.origin);
      
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to send email: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Resend email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async sendTestEmail(to: string): Promise<ResendResponse> {
    const timestamp = new Date().toISOString();
    
    return this.sendEmail({
      to,
      subject: `✅ Resend Test Email - ${timestamp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Resend Email Test</h2>
          <p><strong>Status:</strong> ✅ SUCCESS</p>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>From:</strong> Retirement Ready Vault</p>
          <p><strong>Domain:</strong> mail.ai-focus.org</p>
          
          <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0d9488;">
            <h3 style="color: #0d9488; margin-top: 0;">What this means:</h3>
            <ul>
              <li>✅ Resend API is configured correctly</li>
              <li>✅ Your domain (mail.ai-focus.org) is verified</li>
              <li>✅ Emails can be sent successfully</li>
              <li>✅ API key is valid</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
            <em>This is a test email from your Retirement Ready Vault application.</em>
          </p>
        </div>
      `,
    });
  }
}

export const resendService = new ResendService();

