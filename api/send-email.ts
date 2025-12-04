import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment variable
  const apiKey = process.env.VITE_RESEND_API_KEY;
  
  if (!apiKey) {
    return response.status(500).json({ 
      error: 'Resend API key is not configured on the server' 
    });
  }

  const { to, subject, html, from } = request.body;

  if (!to || !subject || !html) {
    return response.status(400).json({ 
      error: 'Missing required fields: to, subject, html' 
    });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Retirement Ready Vault <noreply@mail.ai-focus.org>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      return response.status(resendResponse.status).json({
        error: errorData.message || `Failed to send email: ${resendResponse.statusText}`,
      });
    }

    const data = await resendResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('Resend API error:', error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
}

