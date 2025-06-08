import { v2 as cloudinary } from "cloudinary";
import { UrlUploadProps } from "../types";
import { getSettings } from "./queries/settings";
import { decryptKey } from "./encryption";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
type CloudinaryResourceType = "image" | "video" | "raw" | "auto";
type CloudinaryUploadType = "upload" | "private" | "authenticated";
type CloudinaryFormat =
  | "jpg"
  | "png"
  | "gif"
  | "webp"
  | "svg"
  | "mp4"
  | "pdf"
  | string;

// More specific interface with stricter types:
export interface StrictCloudinaryUploadResponse {
  api_key: string;
  asset_folder: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  display_name: string;
  etag: string;
  format: CloudinaryFormat;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: CloudinaryResourceType;
  secure_url: string;
  signature: string;
  tags: string[];
  type: CloudinaryUploadType;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
export const generateCloudinaryUrl = async (
  cloudinaryData: StrictCloudinaryUploadResponse,
  optimizers: string[] = ["w_1000", "q_auto", "f_auto"]
) => {
  const settings = await getSettings();
  const cloudName = settings.cloudinaryCloudName.value;
  return `https://res.cloudinary.com/${cloudName}/${cloudinaryData.resource_type}/${cloudinaryData.type}/${optimizers?.length > 0 ? optimizers.join(",") + "/" : ""}${cloudinaryData.public_id}.${cloudinaryData.format}`;
};
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
