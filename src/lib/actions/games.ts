"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Game } from "@/lib/local-db";

const supabase = getSupabaseAdmin();

export async function saveGame(game: Partial<Game>) {
  const isUpdate = !!game.id && game.id !== 'new';
  
  const gameData = {
    title: game.title,
    slug: game.slug || game.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: game.description,
    price: game.price,
    original_price: game.original_price,
    discount_percentage: game.discount_percentage,
    image_url: game.image_url,
    genre: game.genre,
    tags: game.tags,
    steam_app_id: game.steam_app_id,
    series: game.series,
    is_featured: game.is_featured,
    is_hot_deal: game.is_hot_deal,
    is_recently_launched: game.is_recently_launched,
    is_upcoming: game.is_upcoming,
    game_category: game.game_category,
    updated_at: new Date().toISOString(),
  };

  let result;
  if (isUpdate) {
    result = await supabase
      .from('games')
      .update(gameData)
      .eq('id', game.id);
  } else {
    result = await supabase
      .from('games')
      .insert([gameData]);
  }

  if (result.error) {
    console.error("Error saving game:", result.error);
    return { success: false, error: result.error.message };
  }

  revalidatePath('/admin/games');
  revalidatePath('/');
  return { success: true };
}

export async function deleteGame(id: string) {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting game:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/games');
  revalidatePath('/');
  return { success: true };
}
