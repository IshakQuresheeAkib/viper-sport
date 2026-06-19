interface CloudinaryUploadResponse {
  secure_url: string;
}

export async function uploadSelfieToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Photo upload is not configured. Please try again later.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Photo upload failed. Please try again.");
  }

  const payload = (await response.json()) as CloudinaryUploadResponse;

  if (!payload.secure_url) {
    throw new Error("Photo upload failed. Please try again.");
  }

  return payload.secure_url;
}
