import { forwardRef } from "react";
import {
  CARD_HEIGHT,
  CARD_PHOTO_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "@/lib/card-constants";

export interface CardTemplateProps {
  selfieUrl: string;
}

const PHOTO_ZONE_CUT_HEIGHT = Math.round(48 * CARD_SCALE);
const PHOTO_ZONE_SCRIM_HEIGHT = Math.round(220 * CARD_SCALE);
const INFO_HEIGHT = CARD_HEIGHT - CARD_PHOTO_HEIGHT;
const ARG_BLUE = "#75AADB";
const AUT_RED = "#ED1C24";
const MATCHDAY_HEADLINE_SRC = "/images/heading.webp";
const MATCHDAY_TITLE_SRC = "/images/title.webp";

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-full px-2 py-2"
      style={{ border: "2px solid #F8AF07" }}
    >
      <div className="inline-flex max-w-full items-center justify-center gap-1.5 text-center">
        <span className="flex shrink-0 items-center justify-center">
          {icon}
        </span>
        <span
          className="min-w-0 uppercase text-white"
          style={{ fontSize: 16, letterSpacing: "0.02em" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export const CardTemplate = forwardRef<HTMLDivElement, CardTemplateProps>(
  function CardTemplate({ selfieUrl }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 overflow-hidden"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          top: -9999,
          backgroundColor: "#0a0a08",
        }}
      >
        {/* grain texture, full-card, drawn once via SVG filter — renders as static noise in canvas capture */}
        <svg
          className="absolute inset-0"
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* ---- PHOTO ZONE ---- */}
        <div className="relative w-full" style={{ height: CARD_PHOTO_HEIGHT }}>
          {/* clip only the photo layer — headline must sit outside this box so negative bottom offsets are not cropped */}
          <div className="absolute inset-0 overflow-hidden">
            {/* html-to-image capture requires a raw img — next/image breaks canvas export */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selfieUrl}
              alt=""
              crossOrigin="anonymous"
              className="block size-full object-cover"
              width={CARD_WIDTH}
              height={CARD_PHOTO_HEIGHT}
            />

            {/* national-color diagonal gradient overlay, blue to red */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${ARG_BLUE}55 0%, transparent 45%, transparent 55%, ${AUT_RED}55 100%)`,
              }}
            />

            {/* bottom scrim for headline legibility */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: PHOTO_ZONE_SCRIM_HEIGHT,
                background:
                  "linear-gradient(to top, #0a0a08 0%, rgba(10,10,8,0.65) 55%, rgba(10,10,8,0) 100%)",
              }}
            />

            {/* angled cut at base of photo zone, clean single-edge (not jagged) */}
            <svg
              className="absolute inset-x-0 bottom-0"
              width={CARD_WIDTH}
              height={PHOTO_ZONE_CUT_HEIGHT}
              viewBox={`0 0 ${CARD_WIDTH} ${PHOTO_ZONE_CUT_HEIGHT}`}
              preserveAspectRatio="none"
            >
              <polygon
                points={`0,${PHOTO_ZONE_CUT_HEIGHT} ${CARD_WIDTH},${Math.round(14 * CARD_SCALE)} ${CARD_WIDTH},${PHOTO_ZONE_CUT_HEIGHT}`}
                fill="#0a0a08"
              />
            </svg>
          </div>

          {/* ---- TITLE, top center of photo ---- */}
          <div className="absolute inset-x-0 top-0 z-10 mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MATCHDAY_TITLE_SRC}
              alt=""
              crossOrigin="anonymous"
              className="block object-contain w-[280px] h-auto mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* ---- HEADLINE BLOCK — card-level so it stacks above info panel and is not clipped by photo overflow ---- */}
        <div className="absolute left-1/2 z-30 -translate-x-1/2 w-10/12 bottom-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MATCHDAY_HEADLINE_SRC}
            alt=""
            crossOrigin="anonymous"
            className="block w-full object-contain object-left drop-shadow-[0_6px_20px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* ---- INFO PANEL ---- */}
        <div
          className="relative flex flex-col justify-end px-8 gap-10 pb-10"
          style={{ height: INFO_HEIGHT, backgroundColor: "#0a0a08" }}
        >
          {/* registrant name, secondary line */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block rounded-full size-6"
              style={{ backgroundColor: AUT_RED }}
            />
            <p
              className="min-w-0 truncate font-bold uppercase tracking-[0.15em] text-[#F8AF07]"
              style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: 30,
              }}
            >
              I am going to the event
            </p>
          </div>

          {/* info pills row */}
          <div className="flex items-stretch gap-2">
            <Pill
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="9"
                    x2="21"
                    y2="9"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                  <line
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="6"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                  <line
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="6"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                </svg>
              }
              label="22ND JUNE"
            />
            <Pill
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 7v5l4 2"
                    stroke="#F8AF07"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="9PM"
            />
            <Pill
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="9.5"
                    r="2.5"
                    stroke="#F8AF07"
                    strokeWidth="2"
                  />
                </svg>
              }
              label="Kobi Nazrul Auditorium"
            />
          </div>
        </div>
      </div>
    );
  },
);
