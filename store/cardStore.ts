import { create } from "zustand";
import type { CardRegistration, CardStep } from "@/types";

type CardState = {
  step: CardStep;
  registration: CardRegistration | null;
  selfieUrl: string | null;
  cardDataUrl: string | null;
  cardBlob: Blob | null;
  error: string | null;
  setStep: (step: CardStep) => void;
  setRegistration: (registration: CardRegistration) => void;
  setSelfieUrl: (url: string) => void;
  setCardResult: (dataUrl: string, blob: Blob) => void;
  setError: (message: string) => void;
  resetToUpload: () => void;
  reset: () => void;
};

const initialState = {
  step: "validate" as CardStep,
  registration: null,
  selfieUrl: null,
  cardDataUrl: null,
  cardBlob: null,
  error: null,
};

export const useCardStore = create<CardState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step, error: null }),
  setRegistration: (registration) =>
    set({ registration, step: "upload", error: null }),
  setSelfieUrl: (selfieUrl) =>
    set({ selfieUrl, step: "generating", error: null }),
  setCardResult: (cardDataUrl, cardBlob) =>
    set({ cardDataUrl, cardBlob, step: "done", error: null }),
  setError: (error) => set({ error, step: "error" }),
  resetToUpload: () =>
    set({
      step: "upload",
      selfieUrl: null,
      cardDataUrl: null,
      cardBlob: null,
      error: null,
    }),
  reset: () => set(initialState),
}));
