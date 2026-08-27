import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Until a real domain is verified in Resend, this stays on Resend's shared
// sandbox sender (only delivers to the Resend account owner's own verified
// address — fine for testing, not for real customers). Swap once
// frombobwithlove.com exists and is verified there.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

// The business's own inbox — receives contact-form and new-order
// notifications. Same address used elsewhere on the site (see the
// contacts page).
export const BUSINESS_EMAIL = "frombobwithlove@gmail.com";

// Never throws — email is a side effect, not something that should ever
// block a contact-form submission or an order from succeeding. Silently
// no-ops (with a log line) until RESEND_API_KEY is configured, same
// "degrade gracefully without a key" pattern as the Nova Poshta client.
export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  if (!resend) {
    console.log(
      `[email skipped — RESEND_API_KEY not set] to=${input.to} subject="${input.subject}"`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  if (error) {
    console.error("Failed to send email:", error);
  }
}
