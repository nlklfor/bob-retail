import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Set RESEND_FROM_EMAIL to an address on the verified domain, e.g.
// "BOB Retail <hello@frombobwithlove.com>". Without it, this falls back to
// Resend's shared sandbox sender, which only delivers to the Resend
// account owner's own address — fine for testing, not for customers.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// The business's own inbox — receives contact-form and new-order
// notifications, and is where customer replies to any email we send land
// (the sending domain itself has no mailbox).
export const BUSINESS_EMAIL = "frombobwithlove@gmail.com";

// Never throws — email is a side effect, not something that should ever
// block a contact-form submission or an order from succeeding. Silently
// no-ops (with a log line) until RESEND_API_KEY is configured, same
// "degrade gracefully without a key" pattern as the Nova Poshta client.
export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  // For marketing email — lets mail clients show a native "Unsubscribe".
  unsubscribeUrl?: string;
}): Promise<void> {
  if (!resend) {
    console.log(
      `[email skipped — RESEND_API_KEY not set] to=${input.to} subject="${input.subject}"`,
    );
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      replyTo: BUSINESS_EMAIL,
      subject: input.subject,
      text: input.text,
      headers: input.unsubscribeUrl
        ? { "List-Unsubscribe": `<${input.unsubscribeUrl}>` }
        : undefined,
    });

    if (error) {
      console.error("Failed to send email:", error);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
