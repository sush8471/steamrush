"use client";

import { useState, useRef } from "react";
import { 
  Save, 
  Trash2, 
  Upload, 
  X, 
  Plus, 
  Gamepad2, 
  Image as ImageIcon,
  Check,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { saveGame, deleteGame } from "@/lib/actions/games";
import { Game } from "@/lib/local-db";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface GameEditorProps {
  game: Partial<Game>;
  isNew: boolean;
}

export default function GameEditor({ game: initialGame, isNew }: GameEditorProps) {
  const router = useRouter();
  const [game, setGame] = useState(initialGame);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setGame(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setGame(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleTagsChange = (val: string) => {
    setGame(prev => ({
      ...prev,
      tags: val.split(',').map(t => t.trim()).filter(t => t !== "")
    }));
  };

  const handleGenreChange = (val: string) => {
    setGame(prev => ({
      ...prev,
      genre: val.split(',').map(g => g.trim()).filter(g => g !== "")
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `game-posters/${fileName}`;

      const { data, error } = await supabase.storage
        .from('game-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('game-images')
        .getPublicUrl(filePath);

      setGame(prev => ({
        ...prev,
        image_url: publicUrl
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await saveGame(game);
      if (result.success) {
        router.push('/admin/games');
        router.refresh();
      } else {
        alert("Error saving game: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    
    setIsSubmitting(true);
    try {
      const result = await deleteGame(game.id!);
      if (result.success) {
        router.push('/admin/games');
        router.refresh();
      } else {
        alert("Error deleting game: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Game Title</label>
              <input 
                type="text" 
                name="title"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. Cyberpunk 2077"
                value={game.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Slug (URL friendly)</label>
                <input 
                  type="text" 
                  name="slug"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-500"
                  placeholder="e.g. cyberpunk-2077"
                  value={game.slug}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Steam App ID</label>
                <input 
                  type="number" 
                  name="steam_app_id"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. 1091500"
                  value={game.steam_app_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea 
                name="description"
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="Write a brief description about the game..."
                value={game.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Pricing & Categories */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-semibold text-lg">Pricing & Tags</h3>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Sale Price (₹)</label>
                <input 
                  type="number" 
                  step="1"
                  name="price"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  value={game.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Original Price (₹)</label>
                <input 
                  type="number" 
                  step="1"
                  name="original_price"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  value={game.original_price || ""}
                  onChange={handleChange}
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Discount (%)</label>
              <input 
                type="number" 
                name="discount_percentage"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={game.discount_percentage || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Genres (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Action, RPG, Sci-fi"
                value={game.genre?.join(', ')}
                onChange={(e) => handleGenreChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Multiplayer, Open World"
                value={game.tags?.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        {/* Poster Upload */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            Game Poster
          </h3>
          
          <div className="relative aspect-[3/4] w-full bg-slate-800 rounded-xl overflow-hidden group">
            {game.image_url ? (
              <>
                <Image 
                  src={game.image_url} 
                  alt="Game poster" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                </div>
              </>
            ) : (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-sm text-slate-500">Upload Poster</span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Image URL (Alternative)</label>
            <input 
              type="text" 
              name="image_url"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-mono"
              placeholder="https://..."
              value={game.image_url}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Categorization Flags */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-semibold text-lg">Display Flags</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <label className="text-sm font-medium cursor-pointer" htmlFor="is_featured">Featured Game</label>
              <input 
                type="checkbox" 
                id="is_featured"
                className="w-5 h-5 rounded-md border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20"
                checked={game.is_featured}
                onChange={(e) => handleCheckboxChange('is_featured', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <label className="text-sm font-medium cursor-pointer" htmlFor="is_hot_deal">Hot Deal</label>
              <input 
                type="checkbox" 
                id="is_hot_deal"
                className="w-5 h-5 rounded-md border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20"
                checked={game.is_hot_deal}
                onChange={(e) => handleCheckboxChange('is_hot_deal', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <label className="text-sm font-medium cursor-pointer" htmlFor="is_recently_launched">Recently Launched</label>
              <input 
                type="checkbox" 
                id="is_recently_launched"
                className="w-5 h-5 rounded-md border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20"
                checked={game.is_recently_launched}
                onChange={(e) => handleCheckboxChange('is_recently_launched', e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <label className="text-sm font-medium cursor-pointer" htmlFor="is_upcoming">Upcoming Game</label>
              <input 
                type="checkbox" 
                id="is_upcoming"
                className="w-5 h-5 rounded-md border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20"
                checked={game.is_upcoming}
                onChange={(e) => handleCheckboxChange('is_upcoming', e.target.checked)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Store Category</label>
            <select 
              name="game_category"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={game.game_category || "Standard"}
              onChange={handleChange}
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="DLC">DLC / Add-on</option>
              <option value="Bundle">Bundle</option>
            </select>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 h-12 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-900/20"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isNew ? "Create Game" : "Save Changes"}
          </Button>
          
          {!isNew && (
            <Button 
              type="button" 
              variant="ghost"
              className="w-full hover:bg-red-900/20 hover:text-red-400 h-12 rounded-xl flex items-center justify-center gap-2"
              onClick={handleDelete}
              disabled={isSubmitting || isUploading}
            >
              <Trash2 className="w-5 h-5" />
              Delete Game
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full hover:bg-slate-800 h-12 rounded-xl"
            onClick={() => router.push('/admin/games')}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
