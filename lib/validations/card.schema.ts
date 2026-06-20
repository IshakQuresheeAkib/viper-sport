import { normalizeRegistrationId } from "@/lib/registration";
import { z } from "zod";

export const verifyRegistrationSchema = z.object({
  registration_id: z
    .string()
    .trim()
    .min(4, "Enter your registration ID")
    .regex(
      /^REG-[A-F0-9]{8}$/i,
      "Enter a valid registration ID (e.g. REG-XXXXXXXX)",
    )
    .transform(normalizeRegistrationId),
});

export type VerifyRegistrationInput = z.infer<typeof verifyRegistrationSchema>;
