const GALLERY_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALnZ7W0u7d7e4jEc0bh0YZBGDX/9k=";

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

export function getGalleryBlurDataUrl(): string {
  return GALLERY_BLUR;
}
