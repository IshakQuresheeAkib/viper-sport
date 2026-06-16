import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid admin email."),
  password: z.string().min(1, "Password is required.")
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
