export type Registration = {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  qr_data: string;
  sms_sent: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

export type PublicRegistration = Pick<
  Registration,
  "registration_id" | "first_name" | "last_name"
>;

export type RegisterResponse = {
  registration_id: string;
  first_name: string;
  last_name: string;
  already_registered: boolean;
};

export type CheckInResponse = {
  success: true;
  already_checked_in: boolean;
  checked_in_at: string;
};

export type AdminStatusFilter = "all" | "checked_in" | "pending";

export type CardRegistration = {
  registration_id: string;
  first_name: string;
  last_name: string;
};

export type CardStep = "validate" | "upload" | "generating" | "done" | "error";
