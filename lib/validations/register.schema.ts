import { z } from "zod";

export const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladesh phone number")
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const checkInSchema = z.object({
  registration_id: z.string().trim().min(4)
});
