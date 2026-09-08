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
