/** Story export canvas (9:16 portrait) — CSS px; captured at 2× via html-to-image. */
export const CARD_WIDTH = 607;
export const CARD_HEIGHT = 1080;

/** Layout scale vs original 500×640 prototype. */
export const CARD_SCALE = CARD_HEIGHT / 640;

/** Upper photo zone — preserves original 460/640 vertical split at 9:16. */
export const CARD_PHOTO_HEIGHT = Math.round(460 * CARD_SCALE);
