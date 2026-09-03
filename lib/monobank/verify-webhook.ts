import "server-only";
import { createVerify } from "node:crypto";

// Verifies a Monobank webhook's X-Sign header against the raw request body.
// Per Monobank's own reference implementation: the signature is DER-encoded
// ECDSA over SHA-256 of the exact raw bytes Monobank sent (not a re-stringified
// JSON.parse/JSON.stringify round-trip — whitespace/key-order differences
// would break verification), base64-encoded in the header. The public key
// (from getPublicKey()) is PEM-formatted after base64-decoding.
export function verifyMonobankSignature(
  rawBody: string,
  signatureBase64: string,
  publicKeyPem: string,
): boolean {
  try {
    const verifier = createVerify("SHA256");
    verifier.update(rawBody);
    verifier.end();
    return verifier.verify(publicKeyPem, signatureBase64, "base64");
  } catch {
    // A malformed signature/key should fail closed, not throw past the
    // caller and risk an unhandled 500 that could obscure what happened.
    return false;
  }
}
