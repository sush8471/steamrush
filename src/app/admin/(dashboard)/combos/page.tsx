"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Layers, Search, Plus, Edit2, Trash2, Eye, EyeOff, Check, X,
  Loader2, ChevronLeft, ChevronRight, AlertTriangle, Upload, FileImage,
} from "lucide-react";
import Image from "next/image";

type DbCombo = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  original_price: number | null;
  discounted_price: number;
  discount_details: string | null;
  curiosity_cue: string | null;
  value_anchor: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
};

type DbGame = { id: string; title: string };

type DbComboGame = {
  id: string;
  combo_id: string;
  game_id: string;
  display_order: number;
};

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<DbCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCombo, setSelectedCombo] = useState<DbCombo | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<DbCombo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    original_price: "",
    discounted_price: "",
    visible: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [games, setGames] = useState<DbGame[]>([]);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  const autoDiscountBadge = useMemo(() => {
    const orig = parseFloat(formData.original_price);
    const disc = parseFloat(formData.discounted_price);
    if (!isNaN(orig) && !isNaN(disc) && orig > disc && orig > 0) {
      const pct = Math.round(((orig - disc) / orig) * 100);
      return pct > 0 ? `-${pct}%` : "";
    }
    return "";
  }, [formData.original_price, formData.discounted_price]);

  const loadCombos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("combos")
        .select("*")
        .order("display_order", { ascending: true });
      if (fetchError) throw fetchError;
      setCombos(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch combos.");
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    try {
      const { data } = await supabase
        .from("games")
        .select("id, title")
        .order("title", { ascending: true });
      setGames(data || []);
    } catch (err) {
      console.error("Failed to load games:", err);
    }
  };

  const loadComboGames = async (comboId: string) => {
    try {
      const { data } = await supabase
        .from("combo_games")
        .select("game_id")
        .eq("combo_id", comboId)
        .order("display_order", { ascending: true });
      setSelectedGameIds((data || []).map((cg: any) => cg.game_id));
    } catch (err) {
      console.error("Failed to load combo games:", err);
    }
  };

  useEffect(() => {
    loadCombos();
    loadGames();
  }, []);

  const filteredCombos = useMemo(() => {
    return combos.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [combos, searchQuery]);

  const totalPages = Math.ceil(filteredCombos.length / itemsPerPage) || 1;
  const paginatedCombos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCombos.slice(start, start + itemsPerPage);
  }, [filteredCombos, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const resetForm = () => {
    setFormData({ title: "", image_url: "", original_price: "", discounted_price: "", visible: true });
    setSelectedGameIds([]);
    setFormError(null);
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCombo(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = async (combo: DbCombo) => {
    setModalMode("edit");
    setSelectedCombo(combo);
    setFormData({
      title: combo.title,
      image_url: combo.image_url || "",
      original_price: combo.original_price !== null ? combo.original_price.toString() : "",
      discounted_price: combo.discounted_price.toString(),
      visible: combo.visible,
    });
    await loadComboGames(combo.id);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) await handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await handleImageUpload(e.target.files[0]);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { alert("Please upload an image file."); return; }
    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
      const filePath = `combo-images/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("document-uploads")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from("document-uploads")
        .getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      if (err?.message?.includes("Bucket not found") || err?.message?.includes("bucket_not_found")) {
        setFormError("Storage bucket 'document-uploads' not found. Create a public bucket named 'document-uploads' in Supabase Storage.");
      } else {
        setFormError(err?.message || "Failed to upload image.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.title.trim()) return setFormError("Title is required.");
    if (!formData.discounted_price.trim()) return setFormError("Discounted price is required.");

    setFormLoading(true);

    const origNum = formData.original_price.trim() !== "" ? Number(formData.original_price) : null;
    const discNum = Number(formData.discounted_price);
    let discBadge = autoDiscountBadge || null;

    const parsedCombo: any = {
      title: formData.title.trim(),
      image_url: formData.image_url.trim() || null,
      original_price: origNum,
      discounted_price: discNum,
      discount_details: discBadge,
      visible: formData.visible,
    };

    try {
      let comboId: string;

      if (modalMode === "add") {
        const maxOrder = combos.reduce((max, c) => Math.max(max, c.display_order), 0);
        parsedCombo.display_order = maxOrder + 1;
        const { data, error: insertError } = await supabase
          .from("combos").insert([parsedCombo]).select("id").single();
        if (insertError) throw insertError;
        comboId = data.id;
      } else {
        if (!selectedCombo) return;
        comboId = selectedCombo.id;
        const { error: updateError } = await supabase
          .from("combos").update(parsedCombo).eq("id", comboId);
        if (updateError) throw updateError;
        await supabase.from("combo_games").delete().eq("combo_id", comboId);
      }

      if (selectedGameIds.length > 0) {
        const rows = selectedGameIds.map((gameId, i) => ({
          combo_id: comboId, game_id: gameId, display_order: i + 1,
        }));
        const { error: linkError } = await supabase.from("combo_games").insert(rows);
        if (linkError) throw linkError;
      }

      setModalOpen(false);
      loadCombos();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save the combo.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleVisible = async (combo: DbCombo) => {
    const updated = !combo.visible;
    setCombos(prev => prev.map(c => c.id === combo.id ? { ...c, visible: updated } : c));
    try {
      const { error } = await supabase.from("combos").update({ visible: updated }).eq("id", combo.id);
      if (error) throw error;
    } catch {
      setCombos(prev => prev.map(c => c.id === combo.id ? { ...c, visible: combo.visible } : c));
    }
  };

  const handleDeleteSubmit = async () => {
    if (!comboToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from("combos").delete().eq("id", comboToDelete.id);
      if (error) throw error;
      setDeleteOpen(false);
      setComboToDelete(null);
      loadCombos();
    } catch (err: any) {
      alert(err?.message || "Failed to delete the combo.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleGameSelection = (gameId: string) => {
    setSelectedGameIds(prev =>
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Control Bar */}
      <div className="bg-[#111111] border border-[#262626] p-3 lg:p-4 rounded-xl space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search combos..."
            className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-black text-sm rounded-lg hover:brightness-110 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Combo</span>
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading combos...</p>
          </div>
        ) : error ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <p className="text-sm text-gray-300 font-bold">{error}</p>
            <button onClick={loadCombos} className="mt-2 text-xs font-bold text-primary hover:underline">Retry</button>
          </div>
        ) : filteredCombos.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Layers className="w-12 h-12 stroke-[1.25]" />
            <p className="text-sm font-semibold">No combos found</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#262626]/60">
              {paginatedCombos.map((combo) => (
                <div key={combo.id} className="flex items-center gap-3 p-3">
                  <div className="relative w-14 h-10 flex-shrink-0 bg-black/20 rounded border border-[#262626] overflow-hidden">
                    {combo.image_url ? (
                      <Image src={combo.image_url} alt={combo.title} fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Layers className="w-4 h-4 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-white font-bold text-xs leading-tight truncate">{combo.title}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-white">₹{combo.discounted_price}</span>
                      {combo.original_price && <span className="text-[10px] text-muted-foreground line-through">₹{combo.original_price}</span>}
                      {combo.discount_details && (
                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{combo.discount_details}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleToggleVisible(combo)} className={`p-1.5 rounded transition-all cursor-pointer ${combo.visible ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {combo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEditModal(combo)} className="p-1.5 text-muted-foreground hover:text-primary rounded transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { setComboToDelete(combo); setDeleteOpen(true); }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#262626] bg-black/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6 w-16">Image</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6 w-28">Price</th>
                    <th className="py-4 px-6 w-24">Discount</th>
                    <th className="py-4 px-6 w-28 text-center">Visibility</th>
                    <th className="py-4 px-6 w-28 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]/60 text-sm">
                  {paginatedCombos.map((combo) => (
                    <tr key={combo.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-12 h-8 bg-black/20 rounded border border-[#262626] overflow-hidden">
                          {combo.image_url ? (
                            <Image src={combo.image_url} alt={combo.title} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Layers className="w-3 h-3 text-muted-foreground" /></div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-bold text-white max-w-sm truncate" title={combo.title}>{combo.title}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-black text-white">₹{combo.discounted_price}</p>
                        {combo.original_price && <p className="text-xs text-muted-foreground line-through">₹{combo.original_price}</p>}
                      </td>
                      <td className="py-3 px-6">
                        {combo.discount_details ? (
                          <span className="text-xs font-black bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">{combo.discount_details}</span>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleToggleVisible(combo)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            combo.visible ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-muted-foreground border border-gray-500/20 hover:text-white"
                          }`}
                        >
                          {combo.visible ? <><Eye className="w-3.5 h-3.5" /><span>Visible</span></> : <><EyeOff className="w-3.5 h-3.5" /><span>Hidden</span></>}
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2.5">
                          <button onClick={() => openEditModal(combo)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded transition-all cursor-pointer" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { setComboToDelete(combo); setDeleteOpen(true); }} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded transition-all cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredCombos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#262626] px-4 py-3 bg-black/5">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span>–<span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredCombos.length)}</span> of <span className="font-semibold text-white">{filteredCombos.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="p-2 border border-[#262626] rounded-lg bg-[#050505]/50 text-muted-foreground hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs text-muted-foreground min-w-[80px] text-center">Page <span className="font-bold text-white">{currentPage}</span> of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="p-2 border border-[#262626] rounded-lg bg-[#050505]/50 text-muted-foreground hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-[#111111] border border-[#262626] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-fadeIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-white">{modalMode === "add" ? "Add Combo Deal" : "Edit Combo Deal"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {formError && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg leading-relaxed">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text" required value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Fighting Combo"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Image</label>
                  <div
                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                    onClick={() => document.getElementById("combo-file-upload")?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden h-36 bg-[#050505]/20 ${
                      dragActive ? "border-primary bg-primary/5" : "border-[#262626] hover:border-primary/50"
                    }`}
                  >
                    <input type="file" id="combo-file-upload" accept="image/*" onChange={handleFileInput} className="hidden" />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-[10px] text-muted-foreground">Uploading...</p>
                      </div>
                    ) : formData.image_url ? (
                      <>
                        <div className="absolute inset-0 z-0 opacity-30 blur-sm scale-110">
                          <Image src={formData.image_url} alt="" fill className="object-cover" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <FileImage className="w-6 h-6 text-primary" />
                          <p className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded-full border border-white/10">Click or drop to change</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <p className="text-[10px] text-gray-300 font-bold">Drag & drop image or click to browse</p>
                      </>
                    )}
                  </div>
                  <input
                    type="text" value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Or paste image URL"
                    className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-xs text-white focus:outline-none placeholder:text-gray-600 font-mono"
                  />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Original Price</label>
                    <input
                      type="number" value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                      placeholder="1799"
                      className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Selling Price <span className="text-red-500">*</span></label>
                    <input
                      type="number" required value={formData.discounted_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, discounted_price: e.target.value }))}
                      placeholder="199"
                      className="w-full bg-[#050505]/50 border border-[#262626] focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/10 placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Auto discount badge */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Discount Badge (auto)</label>
                  <input
                    type="text" disabled
                    value={autoDiscountBadge || "Enter both prices to calculate"}
                    className="w-full bg-[#111111] border border-[#262626] rounded-lg px-3 py-2 text-sm text-muted-foreground font-bold"
                  />
                </div>

                {/* Game Selector */}
                <div className="space-y-2.5 border-t border-[#262626] pt-5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Include Games ({selectedGameIds.length} selected)
                  </label>
                  <div className="max-h-56 overflow-y-auto bg-[#050505]/40 border border-[#262626] rounded-xl p-3 space-y-1">
                    {games.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No games in catalog.</p>
                    ) : games.map((game) => {
                      const sel = selectedGameIds.includes(game.id);
                      return (
                        <label key={game.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
                          sel ? "bg-primary/10 border border-primary/20 text-white" : "border border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                        }`}>
                          <input type="checkbox" checked={sel} onChange={() => toggleGameSelection(game.id)} className="hidden" />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                            sel ? "bg-primary border-primary" : "border-[#262626] bg-[#050505]/50"
                          }`}>
                            {sel && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                          </div>
                          <span className="truncate">{game.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Visibility */}
                <div className="border-t border-[#262626] pt-5">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                    <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))} className="w-4 h-4 rounded border-[#262626] accent-primary" />
                    <span>Visible on storefront</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#262626] p-4 bg-[#111111] flex justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-[#262626] text-white font-bold text-sm rounded-lg hover:bg-[#363B5E] transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-black text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{modalMode === "add" ? "Save Combo" : "Update Combo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111111] border border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Combo?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Delete <span className="text-white font-semibold">"{comboToDelete?.title}"</span> and all its game links? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setDeleteOpen(false); setComboToDelete(null); }} className="px-4 py-2.5 bg-[#262626] text-white font-bold text-sm rounded-lg hover:bg-[#363B5E] transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleDeleteSubmit} disabled={deleteLoading} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
