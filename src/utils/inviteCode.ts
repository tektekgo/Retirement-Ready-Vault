/**
 * Invite Code Validation
 * 
 * This utility validates invite codes for account registration.
 * 
 * Configuration:
 * - Set VITE_INVITE_CODES in your .env.local file
 * - Can be a single code: VITE_INVITE_CODES=MYCODE123
 * - Or multiple codes (comma-separated): VITE_INVITE_CODES=CODE1,CODE2,CODE3
 * - Codes are case-insensitive
 * 
 * To update codes:
 * 1. Update VITE_INVITE_CODES in Vercel environment variables
 * 2. Redeploy (or wait for auto-deploy)
 * 3. Share new code with trusted users
 */

/**
 * Validates an invite code
 * @param code - The invite code entered by the user
 * @returns true if valid, false otherwise
 */
export const validateInviteCode = (code: string): boolean => {
  // Get invite codes from environment variable
  const envCodes = import.meta.env.VITE_INVITE_CODES || '';
  
  // If no codes configured, allow registration (for development)
  // In production, you should always set VITE_INVITE_CODES
  if (!envCodes || envCodes.trim() === '') {
    console.warn('⚠️ VITE_INVITE_CODES not set - registration is open to everyone');
    // Uncomment the line below to require invite codes even in development
    // return false;
    return true; // Allow registration if codes not configured (for development)
  }
  
  // Normalize the entered code (trim and lowercase)
  const normalizedCode = code.trim().toLowerCase();
  
  // Split codes by comma and normalize each
  const validCodes = envCodes
    .split(',')
    .map((c: string) => c.trim().toLowerCase())
    .filter((c: string) => c.length > 0);
  
  // Check if entered code matches any valid code
  return validCodes.includes(normalizedCode);
};

/**
 * Checks if invite codes are required
 * @returns true if invite codes are configured and required
 */
export const isInviteCodeRequired = (): boolean => {
  const envCodes = import.meta.env.VITE_INVITE_CODES || '';
  return envCodes.trim() !== '';
};

/**
 * Gets a hint about invite code format (for error messages)
 * @returns A hint string or null
 */
export const getInviteCodeHint = (): string | null => {
  // Don't reveal codes, but provide helpful hint
  return 'Please contact the administrator for an invite code.';
};

