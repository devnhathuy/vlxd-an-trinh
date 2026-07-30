import { supabase } from "../lib/supabase";

export async function uploadGalleryImage(file) {
  const extension = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extension}`;

  const filePath = `gallery/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function saveGalleryImages(productId, imageUrls) {
  if (!imageUrls.length) return;

  const rows = imageUrls.map((url, index) => ({
    product_id: productId,
    image_url: url,
    display_order: index + 1,
  }));

  const { error } = await supabase
    .from("product_images")
    .insert(rows);

  if (error) {
    throw error;
  }
}

export async function getGalleryImages(productId) {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("display_order");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function deleteGalleryImages(productId) {
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  if (error) {
    throw error;
  }
}
export async function deleteGalleryImageById(imageId) {
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    throw error;
  }
}