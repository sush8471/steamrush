"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  ExternalLink,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getGames, Game } from "@/lib/local-db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function GamesManagerPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchGames();
  }, [currentPage, searchTerm]);

  async function fetchGames() {
    setIsLoading(true);
    const offset = (currentPage - 1) * pageSize;
    const { data, count, error } = await getGames({
      search: searchTerm,
      limit: pageSize,
      offset: offset
    });

    if (error) {
      console.error("Error fetching games:", error);
    } else {
      setGames(data);
      setTotalCount(count || 0);
    }
    setIsLoading(false);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchGames();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Games Manager</h2>
          <p className="text-slate-400 text-sm">Manage your Steam game inventory and prices</p>
        </div>
        <Link href="/admin/games/new">
          <Button className="bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Game
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search games by title..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{totalCount} games found</span>
          <div className="h-4 w-px bg-slate-800 mx-2" />
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Game</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Flags</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                    <p className="mt-4 text-slate-400">Loading your games...</p>
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    No games found. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden bg-slate-800 flex-shrink-0">
                          <Image 
                            src={game.image_url} 
                            alt={game.title} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{game.title}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <span className="font-mono">ID: {game.id.slice(0, 8)}...</span>
                            {game.steam_app_id && (
                              <a 
                                href={`https://store.steampowered.com/app/${game.steam_app_id}`} 
                                target="_blank" 
                                className="text-slate-600 hover:text-indigo-500 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-white">${Number(game.price).toFixed(2)}</span>
                        {game.original_price && (
                          <span className="text-xs text-slate-500 line-through">${Number(game.original_price).toFixed(2)}</span>
                        )}
                        {game.discount_percentage && (
                          <Badge variant="outline" className="mt-1 text-[10px] text-emerald-400 border-emerald-400/20 py-0 h-4">
                            -{game.discount_percentage}%
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {game.is_featured && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-1 py-0">Featured</Badge>
                        )}
                        {game.is_hot_deal && (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] px-1 py-0">Hot</Badge>
                        )}
                        {game.is_recently_launched && (
                          <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-[10px] px-1 py-0">New</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {game.game_category || "Standard"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/games/${game.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-700 hover:text-indigo-400">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-900/20 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-800/20">
            <p className="text-sm text-slate-500">
              Showing <span className="text-white">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-white">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-white">{totalCount}</span> games
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="bg-slate-900 border-slate-800 hover:bg-slate-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${currentPage === i + 1 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-900 border-slate-800"}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="bg-slate-900 border-slate-800 hover:bg-slate-800 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
