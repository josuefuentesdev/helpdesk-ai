import type { Theme } from "@auth/core/types";
import type { EmailProviderSendVerificationRequestParams } from "next-auth/providers";

export async function sendVerificationRequest(params: EmailProviderSendVerificationRequestParams) {
  const { identifier: to, provider, url, theme } = params;
  const { host } = new URL(url);

  // Type assertion to access apiKey which exists on Resend provider
  const resendProvider = provider as typeof provider & { apiKey?: string };

  if (!resendProvider.apiKey) {
    throw new Error("Resend API key is required");
  }

  if (!provider.from) {
    throw new Error("Resend from address is required");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendProvider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      html: html({ url, host, theme }),
      text: text({ url, host }),
    }),
  });

  if (!res.ok)
    throw new Error("Resend error: " + JSON.stringify(await res.json()));
}

function html(params: { url: string; host: string; theme?: Theme }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  // Use Clean Slate theme colors
  const brandColor = theme?.brandColor ?? "#6366f1"; // Primary purple
  const color = {
    background: "#f8fafc", // Light mode background
    text: "#1e293b", // Light mode foreground
    mainBackground: "#ffffff", // Cards & Popovers: White
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme?.buttonText ?? "#ffffff", // White text on primary button
    muted: "#f3f4f6", // Muted background
    mutedForeground: "#6b7280", // Muted text color
    border: "#d1d5db", // Border color
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ${escapedHost}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${color.background}; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: ${color.mainBackground}; border-radius: 12px; box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10); border: 1px solid ${color.border};">
          <!-- Header with logo -->
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
                      <img src="https://${host}/helpdesk-ai.webp" alt="Helpdesk AI" width="32" height="32" style="display: block;">
                      <span style="font-size: 18px; font-weight: 600; color: ${color.text};">Helpdesk AI</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <!-- Title -->
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: ${color.text}; line-height: 1.2;">
                Sign in to your account
              </h1>
              
              <!-- Subtitle -->
              <p style="margin: 0 0 32px 0; font-size: 14px; color: ${color.mutedForeground}; line-height: 1.5;">
                Click the button below to securely sign in to <strong>${escapedHost}</strong>
              </p>
              
              <!-- Sign in button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <a href="${url}" target="_blank" style="display: inline-block; width: 100%; padding: 12px 24px; background-color: ${color.buttonBackground}; color: ${color.buttonText}; text-decoration: none; font-weight: 500; font-size: 16px; border-radius: 8px; text-align: center; box-sizing: border-box;">
                      Sign in to ${escapedHost}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative link -->
              <div style="padding: 24px; background-color: ${color.muted}; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: ${color.text};">
                  Button not working?
                </p>
                <p style="margin: 0; font-size: 14px; color: ${color.mutedForeground}; word-break: break-all;">
                  Copy and paste this link into your browser:<br>
                  <a href="${url}" style="color: ${color.buttonBackground}; text-decoration: underline;">${url}</a>
                </p>
              </div>
              
              <!-- Footer note -->
              <p style="margin: 0; font-size: 14px; color: ${color.mutedForeground}; line-height: 1.5;">
                If you did not request this email, you can safely ignore it. This link will expire in 24 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid ${color.border};">
              <p style="margin: 0; font-size: 12px; color: ${color.mutedForeground}; text-align: center;">
                This email was sent by Helpdesk AI. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}