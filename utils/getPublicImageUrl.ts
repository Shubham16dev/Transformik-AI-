// utils/getPublicImageUrl.ts
import { supabase } from "./supabase";

export function getPublicImageUrl(bucket: string, path?: string) {
  if (!path) return undefined;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? undefined;
}
