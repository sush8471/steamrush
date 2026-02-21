import { getGameBySlug, Game } from "@/lib/local-db";
import GameEditor from "@/components/admin/GameEditor";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditGamePage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let game: Partial<Game> = {
    title: "",
    slug: "",
    description: "",
    price: 0,
    original_price: null,
    discount_percentage: null,
    image_url: "",
    genre: [],
    tags: [],
    steam_app_id: null,
    series: "",
    is_featured: false,
    is_hot_deal: false,
    is_recently_launched: false,
    is_upcoming: false,
    game_category: "Standard",
  };

  if (!isNew) {
    const { data, error } = await getGameBySlug(params.id);
    if (data) {
      game = data;
    } else {
      console.error("Game not found for editing:", error);
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold">Game Not Found</h2>
          <Link href="/admin/games" className="mt-4 text-indigo-400">Back to Games</Link>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/games">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{isNew ? "Add New Game" : `Edit: ${game.title}`}</h2>
          <p className="text-slate-400 text-sm">{isNew ? "Fill in the details to add a new game to your store" : `Updating game ID: ${game.id}`}</p>
        </div>
      </div>

      <GameEditor game={game} isNew={isNew} />
    </div>
  );
}
