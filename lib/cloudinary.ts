interface CloudinaryImageOptions {
  width?: number;
  quality?: number;
}

export function getCloudinaryImageUrl(
  publicId: string,
  options: CloudinaryImageOptions = {},
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { width = 900, quality = 80 } = options;

  if (!cloudName) {
    return publicId;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${quality},w_${width}/${publicId}`;
}
