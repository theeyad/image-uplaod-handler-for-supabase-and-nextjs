# Full Documentation

Now after you created your supabase bucket and enabled rls policies on it, you can use this component by simply installing these dependencies:

##### Install dependencies

```text
npm install lucide-react tailwind-merge clsx
```

and creating these 3 files:

#### `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to generate a unique ID
export function generateUniqueId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
```

---

#### `lib/uploads.ts`

```typescript
// your supabase client
import { createClient } from "@/lib/supabase/client";
import { generateUniqueId } from "@/lib/utils";

export async function uploadStorageImage(
  file: File,
  bucket: string, // bucket name
  folder: string, // folder name inside that bucket
) {
  // Use your supabase client not server so that the upload
  // is done on the client side.
  const supabase = createClient();

  // Split file name to get extension.
  const fileExt = file.name.split(".").pop();

  // Generate unique filename to avoid storage path collisions.
  const fileName = `${generateUniqueId(Date.now().toString())}.${fileExt}`;

  // Create file path with folder name and unique filename.
  const filePath = `${folder}/${fileName}`;

  // Store the file in the bucket ('uploads') and folder ('images') so
  // that everything is organized in folders and all are in the same bucket.
  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) return { error: error.message };

  // Get public URL of the uploaded file so we can add it to our supabase table.
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { publicUrl };
}
```

---

#### `components/shared/ImageUploader.tsx`

```typescript
"use client";

import { useState, useRef } from "react";
import React from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadStorageImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
  bucket?: string;
  folder?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value = "",
  onChange,
  onError,
  bucket = "uploads",
  folder = "images",
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      onError?.("Please select a valid image file");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadStorageImage(file, bucket, folder);

      if (result.error) {
        onError?.(result.error);
        return;
      }

      if (result.publicUrl) {
        onChange(result.publicUrl);
      }
    } catch {
      onError?.("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
    if ((e.key === "Enter" || e.key === " ") && !disabled && !uploading) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }

  function handleRemoveImage() {
    onChange("");
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-input shadow-sm">
          <Image
            src={value}
            alt="Uploaded Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          tabIndex={disabled || uploading ? -1 : 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg transition-all duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            disabled || uploading
              ? "cursor-not-allowed opacity-60 pointer-events-none"
              : "cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-input bg-background/50 hover:border-muted-foreground/50",
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Uploading image to Supabase...</span>
              </div>
            ) : (
              <>
                <Upload
                  className={cn(
                    "w-7 h-7 mb-2 transition-transform duration-200",
                    isDragging
                      ? "scale-110 text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  PNG, JPG, WebP, GIF, or SVG (max 5MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={disabled || uploading}
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
```

---

now you can use the component and connect it to react hook form like in this example:

```typescript
<ImageUploader
    value={watch("cat_img")}
    onChange={(url) =>
        setValue("cat_img", url, { shouldValidate: true })
    }
    onError={(message) => setError("cat_img", { message })}
    bucket="uploads"
    folder="images"
    disabled={isSubmitting}
/>
```

let's breakdown each prop:

- `value`
The current image URL (string). It uses RHF watch() to see if input has with register "cat_img" got any images uploaded to it or not. If a URL string exists, ImageUploader shows the image preview. If empty `("")`, it shows the upload dropzone.

- `onChange`
Callback function triggered when an image is uploaded or removed.
On successful upload: returns the Supabase public URL.
On removal (clicking `X`): returns an empty string `""`.
`setValue("cat_img", url, { shouldValidate: true })` updates RHF form state and triggers validation immediately.

- `onError`
Callback triggered when an error occurs during selection or upload (e.g., non-image file selected or Supabase upload failure). `setError("cat_img", { message })` sets a field-level error in React Hook Form so UI error message displays below the field.

- `bucket` (Optional — defaults to "uploads")
Supabase Storage bucket name (e.g., 'uploads').

- `folder` (Optional — defaults to "images")
The subfolder path inside the bucket (e.g., 'categories', 'avatars', 'products') to organize files without creating separate buckets.

- `disabled` (Optional — defaults to false)
Accepts a boolean (like RHF's isSubmitting). When true, it disables file picking, drag-and-drop, and the remove button so users cannot upload or delete images while the form is submitting.


> **NOTE**: `ImageUploader` is a standard controlled React component. While I prefered to use React Hook Form (`watch`, `setValue`, `setError`, `isSubmitting`) in my examples, `ImageUploader` works equally well with standard React useState (`const [url, setUrl] = useState('')`).

---

For detailed example of usage with real form see `NewCategoryForm.tsx` in the root of this repo, and `admin.ts` in `src/actions` folder.
