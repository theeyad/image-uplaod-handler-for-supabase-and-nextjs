"use server";

import { createClient } from "@/lib/supabase/server";
import type { FieldValues } from "react-hook-form";

export async function createCategory(values: FieldValues) {
  const supabase = await createClient();

  // NOTE: the bucket name is 'uploads', the folder name is 'images'
  // and the table name is 'categories', this is valid and all are examples.
  // this action is used to create a new category
  const { error } = await supabase.from("categories").insert({
    name: values.cat_name,
    slug: values.cat_name.toLowerCase().replace(/\s+/g, "-"),
    description: values.cat_desc,
    image_url: values.cat_img,
  });

  if (error) return { error: error.message };

  return { success: true };
}
