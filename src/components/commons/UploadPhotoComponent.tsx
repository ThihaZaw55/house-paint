'use client';

import { Camera } from "lucide-react";
import { useRef } from "react";
import Button from "../ui/Button";
import { safeCall } from "../../utils/utils";

type UploadPhotoComponentProps = {
  id?: number | string;
};

export default function UploadPhotoComponent({ id }: UploadPhotoComponentProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);

  const uploadPhoto = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    await safeCall(async () => {
      console.log("Uploading photo", { id, fileName: file.name });
    });
  };

  return (
    <>
      <Button type="button" className="w-full" onClick={() => fileInput.current?.click()} variant="secondary">
        <span className="inline-flex items-center gap-2">
          <Camera size={16} /> Upload Photo
        </span>
      </Button>
      <form className="hidden">
        <input
          type="file"
          name="file"
          ref={fileInput}
          onChange={() => {
            void uploadPhoto();
          }}
        />
      </form>
    </>
  );
}