"use client";

import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface AccountSetupStepThreeProps {
  profilePhoto: File | null;
  setProfilePhoto: (file: File | null) => void;
  error?: string;
}

export function AccountSetupStepThree({
  profilePhoto,
  setProfilePhoto,
  error,
}: AccountSetupStepThreeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => {
    if (!profilePhoto) {
      return null;
    }

    return URL.createObjectURL(profilePhoto);
  }, [profilePhoto]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (file?: File | null) => {
    if (!file) {
      return;
    }

    setProfilePhoto(file);
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleSelectFile(event.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[250px] flex-col items-center justify-center rounded-[24px] px-6 py-8 text-center transition ${
          isDragging ? "bg-[#F3F8FF]" : "bg-[#F7F9FC]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => handleSelectFile(event.target.files?.[0])}
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-[160px] w-[184px] rounded-[16px] object-cover"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 text-[15px] font-medium text-[#4E845F] transition hover:opacity-80"
            >
              Change photo
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex h-[30px] w-[30px] items-center justify-center rounded-[10px] border border-[#9BC5FF] text-[#7CB2FF]">
              <Upload className="h-4 w-4" />
            </div>

            <p className="text-[16px] font-semibold text-[#1D1D1D]">
              Drag your photo here
            </p>

            <p className="mt-2 text-[15px] text-[#A0A8B3]">or</p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 flex h-[52px] items-center justify-center rounded-full bg-[#4E845F] px-7 text-[15px] font-medium text-white transition hover:bg-[#3D6E4D]"
            >
              Select file
            </button>
          </>
        )}
      </div>

      <p className="text-center text-[15px] text-[#7A8594]">
        It should be a max of 2mb, and show your face.
      </p>

      {error && (
        <p className="text-center text-[14px] text-[#C62828]">{error}</p>
      )}
    </div>
  );
}
