import { kineticColors } from "@/lib/kinetic-colors";
import QRCode from "qrcode";

export async function createQrDataUrl(data: string) {
  return QRCode.toDataURL(data, {
    margin: 2,
    scale: 8,
    errorCorrectionLevel: "M",
    color: {
      dark: kineticColors.onPrimaryContainer,
      light: kineticColors.primary,
    },
  });
}
