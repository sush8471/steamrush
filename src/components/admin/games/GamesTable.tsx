"use client";

import { useState, useRef, useCallback } from "react";
import {
  Gamepad2, Plus, Edit2, Trash2, Eye, EyeOff, AlertTriangle,
  MoreVertical, Loader2,
} from "lucide-react";
import Image from "next/image";
import type { DbGame } from "@/types/game";

const HOLD_DELAY_MS = 500;

type Props = {
  loading: boolean;
  error: string | null;
  filteredGames: DbGame[];
  paginatedGames: DbGame[];
  pendingToggleId: string | null;
  onRetry: () => void;
  onToggleVisibility: (game: DbGame) => void;
  onEdit: (game: DbGame) => void;
  onDelete: (game: DbGame) => void;
  onOpenMobileActions: (game: DbGame) => void;
  onAdd: () => void;
  hasActiveFilters: boolean;
};

export default function GamesTable({
  loading,
  error,
  filteredGames,
  paginatedGames,
  pendingToggleId,
  onRetry,
  onToggleVisibility,
  onEdit,
  onDelete,
  onOpenMobileActions,
  onAdd,
  hasActiveFilters,
}: Props) {
  const [heldGameId, setHeldGameId] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdStart = useRef<number>(0);

  const startHold = useCallback((game: DbGame) => {
    holdStart.current = Date.now();
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      setHeldGameId(game.id);
      setHolding(false);
    }, HOLD_DELAY_MS);
  }, []);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding(false);
  }, []);

  const closeActions = useCallback(() => setHeldGameId(null), []);

  if (loading) {
    return (
      <div className="h-72 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-72 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-sm text-gray-300 font-bold">{error}</p>
        <button onClick={onRetry} className="mt-2 text-xs font-bold text-primary hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Gamepad2 className="w-12 h-12 stroke-[1.25]" />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold">No game listings found</p>
          <p className="text-xs text-muted-foreground">
            {hasActiveFilters ? "Try adjusting your filters" : "Get started by adding your first game"}
          </p>
        </div>
        {!hasActiveFilters && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-black text-xs rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border/60">
        {paginatedGames.map((game) => {
          const isHeld = heldGameId === game.id;
          return (
            <div
              key={game.id}
              className="relative select-none touch-none"
              onPointerDown={() => startHold(game)}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Hold progress indicator */}
              {holding && heldGameId !== game.id && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-primary/5" />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary animate-[holdProgress_500ms_linear_forwards]" />
                </div>
              )}

              {/* Normal card content */}
              {!isHeld && (
                <div className="flex items-center gap-4 p-4">
                  <div className="relative w-14 h-20 flex-shrink-0 bg-black/20 rounded-lg border border-border overflow-hidden">
                    <Image src={game.image_url} alt={game.title} fill sizes="56px" className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-white font-bold text-sm leading-tight truncate">{game.title}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">/{game.slug}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {game.selling_price !== null ? (
                        <span className="text-sm font-black text-white">₹{game.selling_price}</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground bg-border/50 px-1.5 py-0.5 rounded">N/A</span>
                      )}
                      {game.discount_percentage ? (
                        <span className="text-[11px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                          -{game.discount_percentage}%
                        </span>
                      ) : null}
                      <span className={`text-[11px] font-black uppercase px-1.5 py-0.5 rounded border ${
                        game.release_status === "released"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}>
                        {game.release_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => onOpenMobileActions(game)}
                      className="p-2.5 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Hold-to-reveal actions */}
              {isHeld && (
                <div className="p-4 bg-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-14 h-20 flex-shrink-0 bg-black/20 rounded-lg border border-primary/30 overflow-hidden">
                      <Image src={game.image_url} alt={game.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{game.title}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">/{game.slug}</p>
                    </div>
                    <button onClick={closeActions} className="text-xs text-muted-foreground hover:text-white px-2 py-1 rounded cursor-pointer">
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { onEdit(game); closeActions(); }}
                      className="flex flex-col items-center gap-1.5 p-3 bg-background border border-border rounded-lg hover:border-primary/40 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-semibold text-white">Edit</span>
                    </button>
                    <button
                      onClick={() => { onToggleVisibility(game); closeActions(); }}
                      className={`flex flex-col items-center gap-1.5 p-3 bg-background border rounded-lg transition-colors cursor-pointer ${
                        game.visible ? "border-emerald-500/20" : "border-border"
                      }`}
                    >
                      {game.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-[11px] font-semibold text-white">{game.visible ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => { onDelete(game); closeActions(); }}
                      className="flex flex-col items-center gap-1.5 p-3 bg-background border border-red-500/20 rounded-lg hover:border-red-500/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span className="text-[11px] font-semibold text-white">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-black/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-4 px-6 w-20">Image</th>
              <th className="py-4 px-6">Title / Series</th>
              <th className="py-4 px-6 w-32">Price</th>
              <th className="py-4 px-6 w-24">Discount</th>
              <th className="py-4 px-6 w-28 text-center">Visibility</th>
              <th className="py-4 px-6 w-28 text-center">Status</th>
              <th className="py-4 px-6 w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {paginatedGames.map((game) => (
              <tr key={game.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-3 px-6">
                  <div className="relative w-10 h-12 bg-black/20 rounded border border-border overflow-hidden">
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
                    <span className="text-xs text-muted-foreground font-bold bg-border/50 px-2 py-0.5 rounded">N/A</span>
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
                    onClick={() => onToggleVisibility(game)}
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
                      onClick={() => onEdit(game)}
                      className="p-2.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded transition-all cursor-pointer"
                      title="Edit game listing"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(game)}
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
  );
}
