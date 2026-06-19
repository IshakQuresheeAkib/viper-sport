import { kineticColors } from "@/lib/kinetic-colors";

type PassInput = {
  registrationId: string;
  firstName: string;
  lastName: string;
  qrDataUrl: string;
};

const PASS_WIDTH = 500;
const PASS_HEIGHT = 680;
const SCALE = 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  fontSuffix: string,
): void {
  let size = maxSize;
  ctx.font = `bold ${size}px ${fontSuffix}`;
  while (ctx.measureText(text).width > maxWidth && size > 11) {
    size -= 1;
    ctx.font = `bold ${size}px ${fontSuffix}`;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function buildPassImage(input: PassInput): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = PASS_WIDTH * SCALE;
  canvas.height = PASS_HEIGHT * SCALE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.scale(SCALE, SCALE);

  const W = PASS_WIDTH;
  const H = PASS_HEIGHT;

  // --- Background ---
  ctx.fillStyle = kineticColors.surface;
  ctx.fillRect(0, 0, W, H);

  // Subtle noise texture overlay via repeating tiny rectangles
  ctx.fillStyle = "rgba(255,255,255,0.015)";
  for (let i = 0; i < W; i += 4) {
    for (let j = 0; j < H; j += 4) {
      if (Math.random() > 0.5) ctx.fillRect(i, j, 2, 2);
    }
  }

  // Top accent bar
  ctx.fillStyle = kineticColors.primaryContainer;
  ctx.fillRect(0, 0, W, 6);

  // --- Card body ---
  roundRect(ctx, 20, 20, W - 40, H - 40, 20);
  ctx.fillStyle = kineticColors.surfaceContainer;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Top accent stripe on card
  roundRect(ctx, 20, 20, W - 40, 6, 4);
  ctx.fillStyle = kineticColors.primaryContainer;
  ctx.fill();

  // --- Header row ---
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(20, 26, W - 40, 56);

  ctx.fillStyle = kineticColors.primary;
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.letterSpacing = "4px";
  ctx.fillText("VIPERSPORT PASS", 40, 58);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = kineticColors.primaryContainer;
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillText(
    "●  VALID ENTRY",
    W - 40 - ctx.measureText("●  VALID ENTRY").width,
    58,
  );

  // Divider line
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 82);
  ctx.lineTo(W - 40, 82);
  ctx.stroke();

  // --- Event title ---
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "bold 10px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("MATCH EVENT", 40, 108);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = kineticColors.primary;
  ctx.font = "bold 26px Georgia, serif";
  ctx.fillText("Argentina vs Austria", 40, 138);

  // --- Date / Venue row ---
  ctx.fillStyle = kineticColors.primaryContainer;
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("22 June 2026, 9:00 PM", 40, 162);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "12px sans-serif";
  ctx.fillText("Kobi Nazrul Auditorium, Rikabibazar, Sylhet", 40, 180);

  // Dashed separator
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 198);
  ctx.lineTo(W - 40, 198);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- Holder info (stacked, full-width) ---
  const nameMaxWidth = W - 80; // 40px padding each side

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "bold 10px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("TICKET HOLDER", 40, 220);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = kineticColors.primary;
  fitText(
    ctx,
    `${input.firstName} ${input.lastName}`,
    nameMaxWidth,
    20,
    "sans-serif",
  );
  ctx.fillText(`${input.firstName} ${input.lastName}`, 40, 244);

  // --- Reg ID (stacked below holder, full-width) ---
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "bold 10px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("REG ID", 40, 270);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = kineticColors.primaryContainer;
  ctx.font = "bold 18px 'Courier New', monospace";
  ctx.fillText(input.registrationId, 40, 294);

  // Dashed separator (second)
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 312);
  ctx.lineTo(W - 40, 312);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- QR code panel ---
  const QR_SIZE = 200;
  const qrX = (W - QR_SIZE) / 2;
  const qrY = 328;

  roundRect(ctx, qrX - 12, qrY - 12, QR_SIZE + 24, QR_SIZE + 24, 12);
  ctx.fillStyle = kineticColors.primary;
  ctx.fill();

  const qrImg = await loadImage(input.qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, QR_SIZE, QR_SIZE);

  // --- Footer ---
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Present this pass at the gate for entry",
    W / 2,
    qrY + QR_SIZE + 36,
  );

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText(input.registrationId, W / 2, qrY + QR_SIZE + 52);

  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}
