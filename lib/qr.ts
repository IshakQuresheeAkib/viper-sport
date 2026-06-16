import QRCode from "qrcode";

export async function createQrDataUrl(data: string) {
  return QRCode.toDataURL(data, {
    margin: 2,
    scale: 8,
    errorCorrectionLevel: "M",
    color: {
      dark: "#990011",
      light: "#ffffff"
    }
  });
}
