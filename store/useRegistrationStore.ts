import { create } from "zustand";

type RegistrationState = {
  registrationId: string | null;
  firstName: string | null;
  lastName: string | null;
  setRegistration: (data: {
    registrationId: string;
    firstName: string;
    lastName: string;
  }) => void;
  reset: () => void;
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  registrationId: null,
  firstName: null,
  lastName: null,
  setRegistration: (data) =>
    set({
      registrationId: data.registrationId,
      firstName: data.firstName,
      lastName: data.lastName
    }),
  reset: () =>
    set({
      registrationId: null,
      firstName: null,
      lastName: null
    })
}));
