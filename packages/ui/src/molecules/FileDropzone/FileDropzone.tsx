"use client";

import { cn, formatFileSize } from "@ssu/utils";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone, type Accept } from "react-dropzone";

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  maxSizeBytes?: number;
  accept?: Accept;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFiles,
  maxSizeBytes = 10 * 1024 * 1024,
  accept,
  description,
  className,
  disabled,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onFiles(accepted);
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxSize: maxSizeBytes,
      accept,
      disabled,
      multiple: false,
    });

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 transition-colors",
          isDragActive && "border-brand-green bg-brand-green-50",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mb-2 h-8 w-8 text-neutral-400" aria-hidden />
        <p className="text-body font-medium text-neutral-700">
          Drag files here or click to browse
        </p>
        {description && (
          <p className="text-small text-neutral-500 mt-1 text-center">
            {description}
          </p>
        )}
        <p className="text-micro text-neutral-400 mt-2">
          Max {formatFileSize(maxSizeBytes)}
        </p>
      </div>
      {fileRejections.length > 0 && (
        <p className="text-small text-red-600" role="alert">
          File rejected. Check size and type.
        </p>
      )}
    </div>
  );
}
