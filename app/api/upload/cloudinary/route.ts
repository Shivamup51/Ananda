import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER;

function createSignature(params: Record<string, string>, secret: string) {
  const sorted = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${sorted}${secret}`)
    .digest("hex");
}

export async function POST(request: Request) {
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary environment variables are not configured." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file provided." },
        { status: 400 },
      );
    }

    const mimeType = file.type || "";
    const isPdf =
      mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    // Upload PDFs as `image` resources in Cloudinary so they are renderable
    // in-browser (raw uploads often force download / fail embed in iframes).
    const resourceType = isPdf
      ? "image"
      : mimeType.startsWith("image/")
      ? "image"
      : mimeType.startsWith("video/")
        ? "video"
        : "raw";

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signingParams: Record<string, string> = { timestamp };
    if (uploadFolder) signingParams.folder = uploadFolder;

    const signature = createSignature(signingParams, apiSecret);

    const cloudinaryBody = new FormData();
    cloudinaryBody.set("file", file);
    cloudinaryBody.set("api_key", apiKey);
    cloudinaryBody.set("timestamp", timestamp);
    cloudinaryBody.set("signature", signature);
    if (uploadFolder) cloudinaryBody.set("folder", uploadFolder);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: cloudinaryBody },
    );

    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      return NextResponse.json(
        {
          error:
            cloudinaryData?.error?.message ?? "Cloudinary upload failed.",
        },
        { status: cloudinaryResponse.status || 400 },
      );
    }

    return NextResponse.json({
      data: {
        url: cloudinaryData.secure_url as string,
        publicId: cloudinaryData.public_id as string,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while uploading file." },
      { status: 500 },
    );
  }
}
