import { supabase } from "../lib/supabase";
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
export async function getRelatedProducts(categoryId, currentProductId) {
  if (!categoryId) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .order("sort_order", { ascending: true })
    .limit(4);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(8);

  if (error) {
    throw error;
  }

  return data ?? [];
}