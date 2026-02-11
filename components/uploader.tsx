"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircleIcon, FileTextIcon, ImageUpIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";

export default function Uploader({
  value,
  onChange,
  uploadEndpoint = "/api/upload/cloudinary",
  accept = "image/*",
}: {
  value?: string;
  onChange?: (_url: string) => void;
  uploadEndpoint?: string;
  accept?: string;
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const lastUploadedFileId = useRef<string | null>(null);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
  });

  const activeFile = files[0]?.file;

  useEffect(() => {
    if (!(activeFile instanceof File)) {
      return;
    }

    const activeId = files[0]?.id;
    if (!activeId || activeId === lastUploadedFileId.current) {
      return;
    }

    lastUploadedFileId.current = activeId;

    const upload = async () => {
      setUploadError(null);
      setIsUploading(true);

      try {
        const body = new FormData();
        body.set("file", activeFile);

        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to upload file.");
        }

        onChange?.(data?.data?.url ?? "");
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload file.",
        );
      } finally {
        setIsUploading(false);
      }
    };

    void upload();
  }, [activeFile, files, onChange, uploadEndpoint]);

  const activeFileType =
    files[0]?.file instanceof File ? files[0].file.type || "" : "";
  const looksLikePdf =
    activeFileType === "application/pdf" ||
    Boolean(value && /\.pdf(?:$|\?)/i.test(value));
  const previewUrl = looksLikePdf ? null : files[0]?.preview || value || null;
  const currentFileName =
    files[0]?.file?.name ||
    (value ? value.split("/").pop()?.split("?")[0] || "uploaded-file" : "");

  function handleRemove() {
    if (files[0]?.id) {
      removeFile(files[0].id);
    }
    onChange?.("");
    setUploadError(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-[img]:border-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={-1}
        >
          <input
            {...getInputProps()}
            aria-label="Upload file"
            className="sr-only"
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <img
                alt={files[0]?.file?.name || "Uploaded image"}
                className="size-full object-cover"
                src={previewUrl}
              />
            </div>
          ) : value && looksLikePdf ? (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                aria-hidden="true"
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              >
                <FileTextIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 font-medium text-sm">PDF ready</p>
              <p className="max-w-full truncate text-muted-foreground text-xs">
                {currentFileName}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                aria-hidden="true"
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 font-medium text-sm">
                Drop your file here or click to browse
              </p>
              <p className="text-muted-foreground text-xs">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              aria-label="Remove image"
              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={handleRemove}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="text-xs text-muted-foreground" role="status">
          Uploading file...
        </div>
      )}

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {uploadError && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
