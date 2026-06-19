import { toPng } from "html-to-image";
import { CARD_HEIGHT, CARD_WIDTH } from "@/lib/card-constants";

const MIN_CARD_DATA_URL_LENGTH = 10_000;

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load photo for card."));
    image.src = src;
  });
}

function waitForImageElement(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image for card."));
  });
}

async function waitForCardImage(
  node: HTMLElement,
  selfieUrl: string,
): Promise<void> {
  await document.fonts.ready;
  await waitForNextFrame();

  const images = node.querySelectorAll("img");

  if (images.length > 0) {
    await Promise.all(
      Array.from(images).map((image) => waitForImageElement(image)),
    );
    return;
  }

  await preloadImage(selfieUrl);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = /:(.*?);/.exec(header);
  const mime = mimeMatch?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

export async function captureCardImage(
  node: HTMLElement,
  selfieUrl: string,
): Promise<{
  dataUrl: string;
  blob: Blob;
}> {
  await waitForCardImage(node, selfieUrl);

  let dataUrl = "";
  let previousLength = 0;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    dataUrl = await toPng(node, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      pixelRatio: 2,
      cacheBust: true,
      style: {
        position: "static",
        top: "0",
        left: "0",
        right: "auto",
        bottom: "auto",
        margin: "0",
        transform: "none",
      },
    });

    if (
      dataUrl.length >= MIN_CARD_DATA_URL_LENGTH &&
      dataUrl.length === previousLength
    ) {
      break;
    }

    previousLength = dataUrl.length;

    if (dataUrl.length >= MIN_CARD_DATA_URL_LENGTH) {
      break;
    }

    await waitForNextFrame();
  }

  if (dataUrl.length < MIN_CARD_DATA_URL_LENGTH) {
    throw new Error("Card capture produced an empty image.");
  }

  const blob = dataUrlToBlob(dataUrl);

  return { dataUrl, blob };
}
