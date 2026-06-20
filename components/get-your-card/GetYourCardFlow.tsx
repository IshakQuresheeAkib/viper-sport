"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import {
  ArrowRight,
  Camera,
  Download,
  Hash,
  Loader2,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CardTemplate } from "@/components/get-your-card/CardTemplate";
import { Button } from "@/components/ui/Button";
import { KineticInput } from "@/components/ui/Input";
import { captureCardImage } from "@/lib/card-capture";
import { uploadSelfieToCloudinary } from "@/lib/cloudinary-upload";
import {
  verifyRegistrationSchema,
  type VerifyRegistrationInput,
} from "@/lib/validations/card.schema";
import { useCardStore } from "@/store/cardStore";
import type { CardRegistration } from "@/types";

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function canShareCardFile(blob: Blob): boolean {
  if (typeof navigator.canShare !== "function") {
    return false;
  }

  const file = new File([blob], "my-matchday-card.png", { type: "image/png" });
  return navigator.canShare({ files: [file] });
}

export function GetYourCardFlow() {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const step = useCardStore((state) => state.step);
  const registration = useCardStore((state) => state.registration);
  const selfieUrl = useCardStore((state) => state.selfieUrl);
  const cardDataUrl = useCardStore((state) => state.cardDataUrl);
  const cardBlob = useCardStore((state) => state.cardBlob);
  const error = useCardStore((state) => state.error);
  const setRegistration = useCardStore((state) => state.setRegistration);
  const setSelfieUrl = useCardStore((state) => state.setSelfieUrl);
  const setCardResult = useCardStore((state) => state.setCardResult);
  const setError = useCardStore((state) => state.setError);
  const resetToUpload = useCardStore((state) => state.resetToUpload);

  const shareSupported = cardBlob ? canShareCardFile(cardBlob) : false;

  async function waitForCardRef(): Promise<void> {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (cardRef.current) {
        return;
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyRegistrationInput>({
    resolver: zodResolver(verifyRegistrationSchema),
    defaultValues: {
      registration_id: "",
    },
  });

  useEffect(() => {
    if (step !== "generating" || !registration || !selfieUrl) {
      return;
    }

    let cancelled = false;

    async function generateCard() {
      try {
        await waitForCardRef();

        if (cancelled || !cardRef.current) {
          throw new Error("Card template is not ready.");
        }

        const { dataUrl, blob } = await captureCardImage(
          cardRef.current,
          selfieUrl!,
        );

        if (!cancelled) {
          setCardResult(dataUrl, blob);
        }
      } catch {
        if (!cancelled) {
          setError("Could not generate your card. Please try again.");
        }
      }
    }

    void generateCard();

    return () => {
      cancelled = true;
    };
  }, [registration, selfieUrl, setCardResult, setError, step]);

  async function onValidate(values: VerifyRegistrationInput) {
    setFormError(null);

    try {
      const response = await fetch(
        `/api/register/verify?id=${encodeURIComponent(values.registration_id)}`,
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (response.status === 404) {
          setFormError("Registration ID not found.");
          return;
        }

        setFormError(payload?.error ?? "Something went wrong, try again.");
        return;
      }

      const payload = (await response.json()) as CardRegistration;
      setRegistration(payload);
    } catch {
      setFormError("Something went wrong, try again.");
    }
  }

  async function handlePhotoSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setFormError("Please upload a JPG, PNG, or WebP photo.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFormError("Photo must be 5 MB or smaller.");
      return;
    }

    setFormError(null);
    setUploading(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const secureUrl = await uploadSelfieToCloudinary(compressed);
      setSelfieUrl(secureUrl);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Photo upload failed. Please try again.";
      setFormError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleDownload() {
    if (!cardDataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = cardDataUrl;
    link.download = "my-matchday-card.png";
    link.click();
  }

  function handleShare() {
    if (!cardBlob) {
      return;
    }

    const file = new File([cardBlob], "my-matchday-card.png", {
      type: "image/png",
    });

    void navigator
      .share({
        files: [file],
        title: "My Matchday Card",
      })
      .then(() => {
        toast.success("Card shared successfully.");
      })
      .catch(() => {
        toast.error("Share was cancelled or failed.");
      });
  }

  return (
    <div className="relative z-10 w-full max-w-lg">
      {step === "validate" ? (
        <section className="glass-card glow-border rounded-2xl border-t-2 border-kinetic/40 p-8 shadow-2xl md:p-10">
          <div className="mb-8 text-center">
            <h2 className=" text-3xl font-medium uppercase  text-kinetic-primary md:text-4xl">
              Get Your <span className="text-kinetic">Card</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-kinetic-secondary md:text-base">
              Enter your registration ID to create a shareable Matchday card.
            </p>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onValidate)}
          >
            <KineticInput
              id="registration_id"
              label="Registration ID"
              icon={<Hash className="size-5" />}
              error={errors.registration_id?.message}
              autoComplete="off"
              placeholder="REG-XXXXXXXX"
              {...register("registration_id")}
            />

            {formError ? (
              <p
                role="alert"
                className="text-sm font-semibold text-kinetic-coral"
              >
                {formError}
              </p>
            ) : null}

            <Button type="submit" fullWidth loading={isSubmitting}>
              Continue
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </form>
        </section>
      ) : null}

      {step === "upload" && registration ? (
        <section className="glass-card glow-border rounded-2xl border-t-2 border-kinetic/40 p-8 shadow-2xl md:p-10">
          <div className="mb-6 text-center">
            <h2 className=" text-2xl font-medium uppercase  text-kinetic-primary md:text-3xl">
              Upload Your Photo
            </h2>
            <p className="mt-2 text-sm text-kinetic-secondary">
              Hi {registration.first_name}, add a selfie for your card.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => void handlePhotoSelect(event)}
          />

          <Button
            type="button"
            fullWidth
            loading={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="size-5" aria-hidden="true" />
            Choose Photo
          </Button>

          {formError ? (
            <p
              role="alert"
              className="mt-4 text-sm font-semibold text-kinetic-coral"
            >
              {formError}
            </p>
          ) : null}

          <p className="mt-4 text-center text-xs text-kinetic-outline">
            JPG, PNG, or WebP · Max 5 MB
          </p>
        </section>
      ) : null}

      {step === "generating" && registration && selfieUrl
        ? createPortal(
            <CardTemplate
              ref={cardRef}
              firstName={registration.first_name}
              lastName={registration.last_name}
              selfieUrl={selfieUrl}
            />,
            document.body,
          )
        : null}

      {step === "generating" && registration && selfieUrl ? (
        <section className="glass-card glow-border rounded-2xl p-8 text-center shadow-2xl md:p-10">
          <Loader2
            className="mx-auto size-10 animate-spin text-kinetic"
            aria-hidden="true"
          />
          <p className="mt-4 font-semibold text-kinetic-on-surface">
            Generating your card...
          </p>
        </section>
      ) : null}

      {step === "done" && registration && cardDataUrl ? (
        <section className="glass-card glow-border rounded-2xl border-t-2 border-kinetic/40 p-8 shadow-2xl md:p-10">
          <div className="mb-6 text-center">
            <h2 className="font-plus-jakarta text-2xl font-medium uppercase  text-kinetic-primary md:text-3xl">
              Your Card Is Ready
            </h2>
            <p className="mt-2 text-sm text-kinetic-secondary">
              Download or share your Matchday card.
            </p>
          </div>

          <div className="mx-auto mb-6 max-w-[220px] overflow-hidden rounded-xl border border-white/10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardDataUrl}
              alt={`Matchday card for ${registration.first_name} ${registration.last_name}`}
              className="h-auto w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button type="button" fullWidth onClick={handleDownload}>
              <Download className="size-5" aria-hidden="true" />
              Download Card
            </Button>

            {shareSupported && cardBlob ? (
              <Button
                type="button"
                fullWidth
                variant="neutral"
                onClick={handleShare}
              >
                <Share2 className="size-5" aria-hidden="true" />
                Share Card
              </Button>
            ) : null}

            <button
              type="button"
              onClick={resetToUpload}
              className="cursor-pointer text-sm font-semibold text-kinetic underline-offset-4 hover:underline"
            >
              Generate again with a different photo
            </button>
          </div>
        </section>
      ) : null}

      {step === "error" ? (
        <section className="glass-card glow-border rounded-2xl p-8 text-center shadow-2xl md:p-10">
          <p role="alert" className="text-sm font-semibold text-kinetic-coral">
            {error ?? "Something went wrong."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button type="button" fullWidth onClick={resetToUpload}>
              Try Again
            </Button>
            <Link
              href="/register"
              className="text-sm font-semibold text-kinetic underline-offset-4 hover:underline"
            >
              Back to registration
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
