/**
 * Registration is closed by default (seats filled).
 * Set REGISTRATION_CLOSED=false in env to reopen public registration.
 */
export function isRegistrationClosed(): boolean {
  return process.env.REGISTRATION_CLOSED !== "false";
}
