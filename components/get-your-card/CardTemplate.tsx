import { forwardRef } from "react";
import { CARD_HEIGHT, CARD_WIDTH } from "@/lib/card-constants";

export interface CardTemplateProps {
  firstName: string;
  lastName: string;
  selfieUrl: string;
}

const PHOTO_HEIGHT = 460;
const INFO_HEIGHT = CARD_HEIGHT - PHOTO_HEIGHT;
const ARG_BLUE = "#75AADB";
const AUT_RED = "#ED1C24";

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2"
      style={{ border: "1.5px solid #facc15" }}
    >
      {icon}
      <span
        className={` uppercase text-white`}
        style={{ fontSize: 12, letterSpacing: "0.02em" }}
      >
        {label}
      </span>
    </div>
  );
}

export const CardTemplate = forwardRef<HTMLDivElement, CardTemplateProps>(
  function CardTemplate({ firstName, lastName, selfieUrl }, ref) {
    const fullName = `${firstName} ${lastName}`.trim();

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 overflow-hidden`}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          top: -9999,
          backgroundColor: "#0a0a08",
        }}
      >
        {/* grain texture, full-card, drawn once via SVG filter — renders as static noise in canvas capture */}
        <svg className="absolute inset-0" width={CARD_WIDTH} height={CARD_HEIGHT}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* ---- PHOTO ZONE ---- */}
        <div className="relative w-full overflow-hidden" style={{ height: PHOTO_HEIGHT }}>
          {/* html-to-image capture requires a raw img — next/image breaks canvas export */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selfieUrl}
            alt=""
            crossOrigin="anonymous"
            className="block size-full object-cover"
            width={CARD_WIDTH}
            height={PHOTO_HEIGHT}
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
              height: 280,
              background:
                "linear-gradient(to top, #0a0a08 0%, rgba(10,10,8,0.75) 55%, rgba(10,10,8,0) 100%)",
            }}
          />

          {/* angled cut at base of photo zone, clean single-edge (not jagged) */}
          <svg
            className="absolute inset-x-0 bottom-0"
            width={CARD_WIDTH}
            height={48}
            viewBox={`0 0 ${CARD_WIDTH} 48`}
            preserveAspectRatio="none"
          >
            <polygon points={`0,48 ${CARD_WIDTH},14 ${CARD_WIDTH},48`} fill="#0a0a08" />
          </svg>

          {/* ---- HEADLINE BLOCK, overlaid on lower photo ---- */}
          <div className="absolute inset-x-0 bottom-12 px-8">
            <p
              className={`font-display uppercase text-white`}
              style={{ fontSize: 64, letterSpacing: "0.01em" }}
            >
              MATCHDAY
            </p>
            <p
              className={`font-display uppercase`}
              style={{ fontSize: 64, color: "#facc15", letterSpacing: "0.01em" }}
            >
              LIVE:
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={` inline-block -skew-x-6 px-4 py-1 uppercase text-white`}
                style={{ fontSize: 30, backgroundColor: ARG_BLUE }}
              >
                ARGENTINA
              </span>
              <span
                className={` uppercase`}
                style={{ fontSize: 30, color: "#facc15" }}
              >
                VS
              </span>
              <span
                className={` inline-block -skew-x-6 px-4 py-1 uppercase text-white`}
                style={{ fontSize: 30, backgroundColor: AUT_RED }}
              >
                AUSTRIA
              </span>
            </div>

            <p
              className={` mt-1 uppercase`}
              style={{ fontSize: 38, color: "#facc15" }}
            >
              IN <span className="font-display">SYLHET</span>
            </p>
          </div>
        </div>

        {/* ---- INFO PANEL ---- */}
        <div
          className="relative flex flex-col justify-between px-8"
          style={{ height: INFO_HEIGHT, backgroundColor: "#0a0a08" }}
        >
          {/* registrant name, secondary line */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, backgroundColor: AUT_RED }}
            />
            <p
              className="font-bold uppercase tracking-[0.15em]"
              style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: 22,
                color: AUT_RED,
              }}
            >
              {fullName} is going
            </p>
          </div>

          {/* info pills row */}
          <div className="flex items-stretch gap-2">
            <Pill
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#facc15" strokeWidth="2" />
                  <line x1="3" y1="9" x2="21" y2="9" stroke="#facc15" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#facc15" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#facc15" strokeWidth="2" />
                </svg>
              }
              label="22ND JUNE"
            />
            <Pill
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#facc15" strokeWidth="2" />
                  <path d="M12 7v5l4 2" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              label="9PM"
            />
            <Pill
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
                    stroke="#facc15"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="#facc15" strokeWidth="2" />
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