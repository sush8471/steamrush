"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Gamepad2, Search, Plus, Edit2, Trash2, Eye, EyeOff, Check, X, 
  Loader2, ChevronLeft, ChevronRight, AlertTriangle, HelpCircle, Sparkles, Upload, FileImage,
  MoreVertical, RotateCcw
} from "lucide-react";
import Image from "next/image";
import GenreSelector from "@/components/admin/genre-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type DbGame = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  selling_price: number | null;
  original_price: number | null;
  discount_percentage: number | null;
  genre: string[];
  tags: string[];
  series: string | null;
  description: string | null;
  release_status: "released" | "upcoming";
  visible: boolean;
  steam_app_id: number | null;
  created_at?: string;
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<DbGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedVisibility, setSelectedVisibility] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "created">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedGame, setSelectedGame] = useState<DbGame | null>(null);

  // Delete State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<DbGame | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Mobile Bottom Sheet Action State
  const [mobileActionGame, setMobileActionGame] = useState<DbGame | null>(null);

  // Visibility toggle confirmation
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image_url: "",
    selling_price: "",
    original_price: "",
    discount_percentage: "",
    genre: "",
    tags: "",
    series: "",
    description: "",
    release_status: "released" as "released" | "upcoming",
    visible: true,
    steam_app_id: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Auto-fill & Upload State
  const [fetchingSteam, setFetchingSteam] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Automatically calculate discount percentage when prices change
  useEffect(() => {
    const sell = parseFloat(formData.selling_price);
    const orig = parseFloat(formData.original_price);
    if (!isNaN(sell) && !isNaN(orig) && orig > 0) {
      const pct = Math.round(((orig - sell) / orig) * 100);
      setFormData(prev => ({ 
        ...prev, 
        discount_percentage: pct > 0 ? pct.toString() : "" 
      }));
    } else {
      setFormData(prev => ({ ...prev, discount_percentage: "" }));
    }
  }, [formData.selling_price, formData.original_price]);

  // Fetch games on mount
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("games")
        .select("*")
        .order("title", { ascending: true });

      if (fetchError) throw fetchError;
      setGames(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch games catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // Compute unique genres for filtering
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => {
      g.genre?.forEach((genre) => set.add(genre));
    });
    return ["All", ...Array.from(set).sort()];
  }, [games]);

  // Handle automatic slug generation in add mode
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (modalMode === "add") {
        updated.slug = val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  // Fetch details from Steam API
  const handleFetchSteam = async () => {
    const appId = formData.steam_app_id.trim();
    if (!appId) {
      setFormError("Please enter a Steam App ID first.");
      return;
    }

    setFetchingSteam(true);
    setFormError(null);

    try {
      const response = await fetch(`/api/steam?appId=${appId}`);
      if (!response.ok) throw new Error("Failed to fetch from Steam Store API.");
      
      const json = await response.json();
      const result = json[appId];

      if (!result || !result.success || !result.data) {
        throw new Error("No data found for this Steam App ID.");
      }

      const sData = result.data;
      
      const title = sData.name || "";
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const genres = sData.genres ? sData.genres.map((g: any) => g.description).join(", ") : "";
      
      setFormData(prev => ({
        ...prev,
        title,
        slug,
        genre: genres,
        tags: `${title.toLowerCase()}, ${genres.toLowerCase()}`
      }));
    } catch (err: any) {
      setFormError(err?.message || "Failed to retrieve details from Steam.");
    } finally {
      setFetchingSteam(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleImageUpload(e.target.files[0]);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setFormError("Please upload an image file.");
      return;
    }

    setUploadingImage(true);
    setFormError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `game-thumbnails/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("document-uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("document-uploads")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      if (err?.message?.includes("Bucket not found") || err?.message?.includes("bucket_not_found")) {
        setFormError("Storage bucket 'document-uploads' not found in your Supabase project. Please create a public bucket named 'document-uploads' in your Supabase Storage dashboard to enable poster uploads.");
      } else {
        setFormError(err?.message || "Failed to upload image.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Open modal for adding
  const openAddModal = () => {
    setModalMode("add");
    setSelectedGame(null);
    setFormData({
      title: "",
      slug: "",
      image_url: "",
      selling_price: "",
      original_price: "",
      discount_percentage: "",
      genre: "",
      tags: "",
      series: "",
      description: "",
      release_status: "released",
      visible: true,
      steam_app_id: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (game: DbGame) => {
    setModalMode("edit");
    setSelectedGame(game);
    setFormData({
      title: game.title,
      slug: game.slug,
      image_url: game.image_url,
      selling_price: game.selling_price !== null ? game.selling_price.toString() : "",
      original_price: game.original_price !== null ? game.original_price.toString() : "",
      discount_percentage: game.discount_percentage !== null ? game.discount_percentage.toString() : "",
      genre: game.genre ? game.genre.join(", ") : "",
      tags: game.tags ? game.tags.join(", ") : "",
      series: game.series || "",
      description: game.description || "",
      release_status: game.release_status,
      visible: game.visible,
      steam_app_id: game.steam_app_id !== null ? game.steam_app_id.toString() : "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Submit Form Action
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) return setFormError("Title is required.");
    if (!formData.slug.trim()) return setFormError("Slug is required.");
    if (!formData.image_url.trim()) return setFormError("Image URL/Poster is required.");

    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(formData.slug)) {
      return setFormError("Slug must contain only lowercase letters, numbers, hyphens, and underscores.");
    }

    setFormLoading(true);

    const parsedGame: Partial<DbGame> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      image_url: formData.image_url.trim(),
      selling_price: formData.selling_price.trim() !== "" ? Number(formData.selling_price) : null,
      original_price: formData.original_price.trim() !== "" ? Number(formData.original_price) : null,
      discount_percentage: formData.discount_percentage.trim() !== "" ? parseInt(formData.discount_percentage) : null,
      genre: formData.genre ? formData.genre.split(",").map(g => g.trim()).filter(Boolean) : [],
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      series: formData.series.trim() || null,
      description: formData.description.trim() || null,
      release_status: formData.release_status,
      visible: formData.visible,
      steam_app_id: formData.steam_app_id.trim() !== "" ? parseInt(formData.steam_app_id) : null,
    };

    try {
      if (modalMode === "add") {
        const { error: insertError } = await supabase
          .from("games")
          .insert([parsedGame]);

        if (insertError) throw insertError;
      } else {
        if (!selectedGame) return;
        const { error: updateError } = await supabase
          .from("games")
          .update(parsedGame)
          .eq("id", selectedGame.id);

        if (updateError) throw updateError;
      }

      setModalOpen(false);
      toast.success(modalMode === "add" ? "Game listing created" : "Game listing updated");
      loadGames();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save the game listing.");
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle visible value inline
  const handleToggleVisible = async (game: DbGame) => {
    if (pendingToggleId === game.id) {
      // Confirmed — perform the toggle
      setPendingToggleId(null);
      const updatedVisible = !game.visible;

      setGames(prev =>
        prev.map(g => (g.id === game.id ? { ...g, visible: updatedVisible } : g))
      );

      try {
        const { error: updateError } = await supabase
          .from("games")
          .update({ visible: updatedVisible })
          .eq("id", game.id);

        if (updateError) throw updateError;
        toast.success(updatedVisible ? "Game is now visible on storefront" : "Game is now hidden from storefront");
      } catch (err) {
        console.error("Failed to update visibility:", err);
        setGames(prev =>
          prev.map(g => (g.id === game.id ? { ...g, visible: game.visible } : g))
        );
        toast.error("Failed to update visibility");
      }
    } else {
      // First tap — set pending
      setPendingToggleId(game.id);
      setTimeout(() => setPendingToggleId(prev => prev === game.id ? null : prev), 3000);
    }
  };

  // Open Delete Confirmation
  const openDeleteConfirm = (game: DbGame) => {
    setGameToDelete(game);
    setDeleteError(null);
    setDeleteOpen(true);
  };

  // Delete Action Submit
  const handleDeleteSubmit = async () => {
    if (!gameToDelete) return;
    setDeleteLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("games")
        .delete()
        .eq("id", gameToDelete.id);

      if (deleteError) throw deleteError;

      setDeleteOpen(false);
      setGameToDelete(null);
      setDeleteError(null);
      toast.success("Game listing deleted");
      loadGames();
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete the game listing.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.series && game.series.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre =
        selectedGenre === "All" || game.genre?.includes(selectedGenre);

      const matchesVisibility =
        selectedVisibility === "All" ||
        (selectedVisibility === "Visible" && game.visible) ||
        (selectedVisibility === "Hidden" && !game.visible);

      return matchesSearch && matchesGenre && matchesVisibility;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "price") return (a.selling_price ?? 0) - (b.selling_price ?? 0);
      return 0; // created — use default order from DB
    });
  }, [games, searchQuery, selectedGenre, selectedVisibility, sortBy]);

  // Compute pagination values
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage) || 1;
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedVisibility]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Control Bar */}
      <div className="bg-[#111111] border border-[#262626] p-3 lg:p-4 rounded-xl space-y-3">
        {/* Search — full width */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, series, or slug..."
            className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white rounded transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters row + Add button */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="flex-1 min-w-[130px] bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer"
          >
            {allGenres.map((g) => (
              <option key={g} value={g}>
                Genre: {g}
              </option>
            ))}
          </select>

          {/* Visibility Filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="flex-1 min-w-[130px] bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer"
          >
            <option value="All">Visibility: All</option>
            <option value="Visible">Visible Only</option>
            <option value="Hidden">Hidden Only</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "price" | "created")}
            className="flex-1 min-w-[110px] bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="created">Sort: Created</option>
          </select>

          {/* Reset filters */}
          {(searchQuery || selectedGenre !== "All" || selectedVisibility !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
                setSelectedVisibility("All");
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg border border-[#262626] transition-all cursor-pointer"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Add Game Button */}
          <Button onClick={openAddModal} className="w-full sm:w-auto font-black active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Add Game
          </Button>
        </div>
      </div>

      {/* Main Panel */}
      <div
        className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-xl"
        onTouchStart={(e) => {
          const el = e.currentTarget;
          el.dataset.touchStartY = String(e.touches[0].clientY);
          el.dataset.touchStartScroll = String(el.scrollTop);
        }}
        onTouchMove={(e) => {
          const el = e.currentTarget;
          const startY = Number(el.dataset.touchStartY || 0);
          const startScroll = Number(el.dataset.touchStartScroll || 0);
          const currentY = e.touches[0].clientY;
          const diff = currentY - startY;
          if (startScroll <= 0 && diff > 120 && !el.dataset.pullTriggered) {
            el.dataset.pullTriggered = "1";
            loadGames();
            toast.success("Refreshing games...");
          }
        }}
        onTouchEnd={(e) => {
          const el = e.currentTarget;
          delete el.dataset.touchStartY;
          delete el.dataset.touchStartScroll;
          delete el.dataset.pullTriggered;
        }}
      >
        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <p className="text-sm text-gray-300 font-bold">{error}</p>
            <button onClick={loadGames} className="mt-2 text-xs font-bold text-primary hover:underline">
              Retry
            </button>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Gamepad2 className="w-12 h-12 stroke-[1.25]" />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold">No game listings found</p>
              <p className="text-xs text-muted-foreground">{searchQuery || selectedGenre !== "All" || selectedVisibility !== "All" ? "Try adjusting your filters" : "Get started by adding your first game"}</p>
            </div>
            {!searchQuery && selectedGenre === "All" && selectedVisibility === "All" && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-black text-xs rounded-lg hover:brightness-110 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Game</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Mobile Card List (< md) ── */}
            <div className="md:hidden divide-y divide-[#262626]/60">
              {paginatedGames.map((game) => (
                <div key={game.id} className="flex items-center gap-3 p-3">
                  {/* Poster */}
                  <div className="relative w-10 h-14 flex-shrink-0 bg-black/20 rounded border border-[#262626] overflow-hidden">
                    <Image src={game.image_url} alt={game.title} fill sizes="40px" className="object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-white font-bold text-xs leading-tight truncate">{game.title}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">/{game.slug}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Price */}
                      {game.selling_price !== null ? (
                        <span className="text-xs font-black text-white">₹{game.selling_price}</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground bg-[#262626] px-1.5 py-0.5 rounded">N/A</span>
                      )}
                      {/* Discount badge */}
                      {game.discount_percentage ? (
                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                          -{game.discount_percentage}%
                        </span>
                      ) : null}
                      {/* Status badge */}
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${
                        game.release_status === "released"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}>
                        {game.release_status}
                      </span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center flex-shrink-0">
                    {/* More actions drawer trigger */}
                    <button
                      onClick={() => setMobileActionGame(game)}
                      className="p-2.5 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop Table (≥ md) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#262626] bg-black/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6 w-20">Image</th>
                    <th className="py-4 px-6">Title / Series</th>
                    <th className="py-4 px-6 w-32">Price</th>
                    <th className="py-4 px-6 w-24">Discount</th>
                    <th className="py-4 px-6 w-28 text-center">Visibility</th>
                    <th className="py-4 px-6 w-28 text-center">Status</th>
                    <th className="py-4 px-6 w-28 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]/60 text-sm">
                  {paginatedGames.map((game) => (
                    <tr key={game.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-6">
                        <div className="relative w-10 h-12 bg-black/20 rounded border border-[#262626] overflow-hidden">
                          <Image src={game.image_url} alt={game.title} fill sizes="40px" className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-bold text-white max-w-sm truncate" title={game.title}>{game.title}</p>
                        <p className="text-xs text-muted-foreground font-mono tracking-tighter truncate max-w-xs" title={game.slug}>/{game.slug}</p>
                      </td>
                      <td className="py-3 px-6">
                        {game.selling_price !== null ? (
                          <div>
                            <p className="font-black text-white">₹{game.selling_price}</p>
                            {game.original_price && (
                              <p className="text-xs text-muted-foreground line-through">₹{game.original_price}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-bold bg-[#262626] px-2 py-0.5 rounded">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {game.discount_percentage ? (
                          <span className="text-xs font-black bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">
                            -{game.discount_percentage}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleToggleVisible(game)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                            pendingToggleId === game.id
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : game.visible
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-gray-500/10 text-muted-foreground border border-gray-500/20 hover:text-white"
                          }`}
                        >
                          {pendingToggleId === game.id ? (
                            <><AlertTriangle className="w-3.5 h-3.5" /><span>Confirm?</span></>
                          ) : game.visible ? (
                            <><Eye className="w-3.5 h-3.5" /><span>Visible</span></>
                          ) : (
                            <><EyeOff className="w-3.5 h-3.5" /><span>Hidden</span></>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border ${
                          game.release_status === "released"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}>
                          {game.release_status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => openEditModal(game)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded transition-all cursor-pointer"
                            title="Edit game listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(game)}
                            className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded transition-all cursor-pointer"
                            title="Delete game listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {!loading && filteredGames.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#262626] px-4 py-3 bg-black/5">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Showing{" "}
              <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> –{" "}
              <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredGames.length)}</span>{" "}
              of <span className="font-semibold text-white">{filteredGames.length}</span> games
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2.5 border border-[#262626] rounded-lg bg-[#050505]/50 text-muted-foreground hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground min-w-[80px] text-center">
                Page <span className="font-bold text-white">{currentPage}</span> of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2.5 border border-[#262626] rounded-lg bg-[#050505]/50 text-muted-foreground hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-2xl bg-[#111111] border border-[#262626] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-white">
                {modalMode === "add" ? "Add Game Listing" : "Edit Game Listing"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {formError && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg leading-relaxed">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

              {/* Section: Media & Autofill */}
              <div className="border-t border-[#262626] pt-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Media & Autofill</p>

              {/* Steam Autofill Control */}
              <div className="bg-[#050505]/40 border border-[#262626] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Autofill from Steam Store</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 relative group">
                    <input
                      type="number"
                      value={formData.steam_app_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, steam_app_id: e.target.value }))}
                      placeholder="Enter Steam App ID (e.g. 3768760)"
                      className="w-full bg-[#050505]/80 border border-[#262626] focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={fetchingSteam || !formData.steam_app_id}
                    onClick={handleFetchSteam}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed font-black text-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {fetchingSteam ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Autofill details</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  If entered, clicking autofill will fetch title, genres, search keywords, and poster cover directly from the official Steam repository.
                </p>
              </div>

              {/* Poster Thumbnail Drag & Drop Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Game Poster Cover Thumbnail <span className="text-red-500">*</span>
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer relative overflow-hidden h-48 bg-[#050505]/20 ${
                    dragActive ? "border-primary bg-primary/5" : "border-[#262626] hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">Uploading poster image...</p>
                    </div>
                  ) : formData.image_url ? (
                    <>
                      <div className="absolute inset-0 z-0 opacity-40 blur-sm scale-110">
                        <Image
                          src={formData.image_url}
                          alt="Cover background"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <FileImage className="w-8 h-8 text-primary filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
                        <p className="text-xs text-white font-bold bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                          Change dropped poster or select file
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center space-y-1">
                        <p className="text-xs text-gray-300 font-bold">Drag & drop game poster image here</p>
                        <p className="text-[10px] text-muted-foreground">or click to browse local files (PNG, JPG, WebP)</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Plain Text Fallback Image URL */}
                <input
                  type="text"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="Or enter poster URL manually (e.g. /gta-v.jpg)"
                  className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-xs text-white focus:outline-none placeholder:text-gray-600 font-mono"
                />
              </div>
              </div>

              {/* Section: Basic Info */}
              <div className="border-t border-[#262626] pt-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Basic Info</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Game Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter Title Name"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Auto-generated slug name"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Original Price (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                    placeholder="Original Price"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Selling Price (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.selling_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
                    placeholder="Selling/Discounted Price"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>

                {/* Discount Percentage (Calculated automatically) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Calculated Discount (%)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.discount_percentage ? `${formData.discount_percentage}%` : "0% (Auto-Calculated)"}
                    className="w-full bg-[#111111] border border-[#262626] rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none font-bold"
                  />
                </div>

                {/* Series */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Series Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.series}
                    onChange={(e) => setFormData(prev => ({ ...prev, series: e.target.value }))}
                    placeholder="Series Name"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>
              </div>
              </div>

              {/* Section: Metadata */}
              <div className="border-t border-[#262626] pt-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Metadata</p>

              {/* Genre (Pill checkboxes format) */}
              <GenreSelector
                value={formData.genre}
                onChange={(genre) => setFormData(prev => ({ ...prev, genre }))}
              />

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Search Aliases / Tags (Comma separated list)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="mario, nintendo, platforms"
                  className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Description / Blurb (Optional - Fetched from Steam on detail page)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="No need to fill this in if you have Steam App ID. It will be fetched automatically."
                  className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600 resize-none"
                />
              </div>
              </div>

              {/* Section: Publishing */}
              <div className="border-t border-[#262626] pt-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Publishing</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Release Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider font-bold">
                    Release Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        name="release_status"
                        value="released"
                        checked={formData.release_status === "released"}
                        onChange={() => setFormData(prev => ({ ...prev, release_status: "released" }))}
                        className="accent-primary"
                      />
                      <span>Released</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        name="release_status"
                        value="upcoming"
                        checked={formData.release_status === "upcoming"}
                        onChange={() => setFormData(prev => ({ ...prev, release_status: "upcoming" }))}
                        className="accent-primary"
                      />
                      <span>Upcoming</span>
                    </label>
                  </div>
                </div>

                {/* Visible Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Storefront Visibility
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                      className="w-4 h-4 rounded border-[#262626] accent-primary"
                    />
                    <span>Make listing visible on public storefront</span>
                  </label>
                </div>
              </div>

              </div>
              </div>

              {/* Form Actions Footer */}
              <div className="border-t border-[#262626] p-4 bg-[#111111] flex justify-end gap-3 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="font-black active:scale-[0.98]"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === "add" ? "Save Game" : "Update Game"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111111] border border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Listing?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to delete <span className="text-white font-semibold">"{gameToDelete?.title}"</span>? This will permanently remove the record and any storefront homepage section mappings. This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg leading-relaxed">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDeleteOpen(false);
                  setGameToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteSubmit}
                disabled={deleteLoading}
                className="active:scale-[0.98]"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete permanently
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Action Sheet Drawer */}
      <Sheet open={!!mobileActionGame} onOpenChange={(open) => !open && setMobileActionGame(null)}>
        <SheetContent side="bottom" className="bg-[#111111] border-t border-[#262626] rounded-t-2xl shadow-2xl p-6 flex flex-col space-y-4 md:hidden">
          {mobileActionGame && (
            <>
              <SheetHeader className="border-b border-[#262626] pb-3">
                <SheetTitle className="text-white text-sm font-bold truncate">{mobileActionGame.title}</SheetTitle>
                <SheetDescription className="text-[10px] text-muted-foreground font-mono">/{mobileActionGame.slug}</SheetDescription>
              </SheetHeader>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* Toggle visibility */}
                <button
                  onClick={() => {
                    handleToggleVisible(mobileActionGame);
                    if (pendingToggleId === mobileActionGame.id) {
                      setMobileActionGame(null);
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    pendingToggleId === mobileActionGame.id
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : mobileActionGame.visible
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-gray-500/5 text-muted-foreground border-gray-500/10"
                  }`}
                >
                  {pendingToggleId === mobileActionGame.id ? (
                    <><AlertTriangle className="w-4 h-4" /><span>Tap again to confirm</span></>
                  ) : mobileActionGame.visible ? (
                    <><Eye className="w-4 h-4" /><span>Storefront Visibility: Visible</span></>
                  ) : (
                    <><EyeOff className="w-4 h-4" /><span>Storefront Visibility: Hidden</span></>
                  )}
                </button>

                {/* Edit Listing */}
                <button
                  onClick={() => {
                    openEditModal(mobileActionGame);
                    setMobileActionGame(null);
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-[#262626]/50 hover:bg-[#262626] border border-[#262626] text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                  <span>Edit Game Details</span>
                </button>

                {/* Delete Listing */}
                <button
                  onClick={() => {
                    openDeleteConfirm(mobileActionGame);
                    setMobileActionGame(null);
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Game Listing</span>
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
