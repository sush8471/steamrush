"use client";

import {
  X, AlertTriangle, Sparkles, Loader2, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GenreSelector from "@/components/admin/genre-selector";
import type { GameFormData } from "@/types/game";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  formData: GameFormData;
  onFormDataChange: (updater: (prev: GameFormData) => GameFormData) => void;
  formError: string | null;
  formLoading: boolean;
  fetchingSteam: boolean;
  uploadingImage: boolean;
  dragActive: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFetchSteam: () => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function GameFormModal({
  open,
  onClose,
  mode,
  formData,
  onFormDataChange,
  formError,
  formLoading,
  fetchingSteam,
  uploadingImage,
  dragActive,
  onSubmit,
  onTitleChange,
  onFetchSteam,
  onDrag,
  onDrop,
  onFileInput,
}: Props) {
  if (!open) return null;

  const set = (field: keyof GameFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onFormDataChange((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-card border border-border sm:rounded-xl rounded-t-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-base font-bold text-foreground">
            {mode === "add" ? "Add Game" : "Edit Game"}
          </h3>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {formError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Steam Autofill */}
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={formData.steam_app_id}
                  onChange={set("steam_app_id")}
                  placeholder="Steam App ID"
                  className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-mono"
                />
              </div>
              <button
                type="button"
                disabled={fetchingSteam || !formData.steam_app_id}
                onClick={onFetchSteam}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {fetchingSteam ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Autofill
              </button>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.image_url}
                  onChange={set("image_url")}
                  placeholder="/game-cover.jpg or paste URL"
                  className="flex-1 bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                />
                <div
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className={`flex items-center gap-2 px-4 py-2 bg-background border border-dashed ${dragActive ? "border-primary bg-primary/5" : "border-border"} rounded-lg cursor-pointer hover:border-primary/50 transition-colors text-xs text-muted-foreground whitespace-nowrap`}
                >
                  {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Browse
                </div>
              </div>
              <input type="file" id="file-upload" accept="image/*" onChange={onFileInput} className="hidden" />
              <div
                onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}
                className="border border-dashed border-border rounded-lg px-3 py-2 text-[10px] text-center text-muted-foreground bg-background/50 cursor-pointer hover:border-primary/40 transition-colors"
              >
                {formData.image_url ? "Cover image set. Drop or click to change." : "Drop image here to upload"}
              </div>
            </div>

            {/* Title + Slug */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Title *</label>
                <input type="text" required value={formData.title} onChange={onTitleChange} placeholder="Game title" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Slug *</label>
                <input type="text" required value={formData.slug} onChange={set("slug")} placeholder="game-slug" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-mono" />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Original Price</label>
                <input type="number" value={formData.original_price} onChange={set("original_price")} placeholder="₹" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Selling Price</label>
                <input type="number" value={formData.selling_price} onChange={set("selling_price")} placeholder="₹" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Discount</label>
                <input type="text" disabled value={formData.discount_percentage ? `${formData.discount_percentage}%` : "Auto"} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground font-mono" />
              </div>
            </div>

            {/* Genre + Series */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Genre</label>
                <GenreSelector value={formData.genre} onChange={(genre) => onFormDataChange((prev) => ({ ...prev, genre }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Series</label>
                <input type="text" value={formData.series} onChange={set("series")} placeholder="Series name" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Description (optional)</label>
              <textarea rows={3} value={formData.description} onChange={set("description")} placeholder="Auto-fetched from Steam if App ID is set" className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 resize-none" />
            </div>

            {/* Publishing */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                  <input type="radio" name="release_status" value="released" checked={formData.release_status === "released"} onChange={() => onFormDataChange((prev) => ({ ...prev, release_status: "released" }))} className="accent-primary" />
                  Released
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                  <input type="radio" name="release_status" value="upcoming" checked={formData.release_status === "upcoming"} onChange={() => onFormDataChange((prev) => ({ ...prev, release_status: "upcoming" }))} className="accent-primary" />
                  Upcoming
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                <input type="checkbox" checked={formData.visible} onChange={(e) => onFormDataChange((prev) => ({ ...prev, visible: e.target.checked }))} className="w-4 h-4 rounded accent-primary" />
                Visible
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-5 py-3.5 border-t border-border bg-card">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={formLoading} className="font-bold active:scale-[0.98]">
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "add" ? "Save Game" : "Update Game"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
