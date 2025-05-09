import { v2 as cloudinary } from "cloudinary";
import { UrlUploadProps } from "../types";
import { getSettings } from "./queries/settings";
import { decryptKey } from "./encryption";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
export const getCloudinary = async () => {
  const settings = await getSettings();
  if (
    !settings.cloudinaryCloudName.value ||
    !settings.cloudinaryApiKey.value ||
    !settings.cloudinaryApiSecret.value
  ) {
    throw new Error("Cloudinary credentials are not set");
  }
  return cloudinary.config({
    cloud_name: settings.cloudinaryCloudName.value,
    api_key: settings.cloudinaryApiKey.value,
    api_secret: decryptKey(settings.cloudinaryApiSecret.value),
  });
};
export const generateSignature = async (
  folder: string,
  timestamp: number,
  apiSecret: string
) => {
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    apiSecret
  );
  return signature;
};

export const uploadFromUrl = async ({
  url,
  folder = "uploads",
  filename,
}: UrlUploadProps) => {
  await getCloudinary();
  try {
    const uploadResult = await cloudinary.uploader.upload(url, {
      folder,
      ...(filename && { public_id: filename }),
    });
    return uploadResult;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload file from URL");
  }
};
