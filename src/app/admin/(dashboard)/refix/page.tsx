"use client";

import { useEffect, useState } from "react";
import {
  getAllRefixRequests,
  updateRefixRequest,
  type RefixRequest,
  type RefixStatus,
} from "@/lib/db/refix-db";
import { Loader2, ChevronDown, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS: RefixStatus[] = ["pending", "scheduled", "resolved", "closed"];

const STATUS_COLORS: Record<RefixStatus, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  resolved:  "bg-green-500/10 text-green-400 border-green-500/20",
  closed:    "bg-white/5 text-muted-foreground border-white/10",
};

export default function AdminRefixPage() {
  const [requests, setRequests] = useState<RefixRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  // Per-row editable fields
  const [edits, setEdits] = useState<
    Record<string, { scheduledAt: string; adminNote: string }>
  >({});

  useEffect(() => {
    async function load() {
      const data = await getAllRefixRequests();
      setRequests(data);
      // Seed edits state
      const seed: typeof edits = {};
      for (const r of data) {
        seed[r.id] = {
          scheduledAt: r.scheduled_at
            ? new Date(r.scheduled_at).toISOString().slice(0, 16)
            : "",
          adminNote: r.admin_note ?? "",
        };
      }
      setEdits(seed);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (req: RefixRequest, newStatus: RefixStatus) => {
    setSaving(req.id);
    const edit = edits[req.id];
    await updateRefixRequest(req.id, {
      status: newStatus,
      scheduled_at: edit?.scheduledAt ? new Date(edit.scheduledAt).toISOString() : null,
      admin_note: edit?.adminNote || null,
    });
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? {
              ...r,
              status: newStatus,
              scheduled_at: edit?.scheduledAt
                ? new Date(edit.scheduledAt).toISOString()
                : null,
              admin_note: edit?.adminNote || null,
            }
          : r
      )
    );
    setSaving(null);
    toast.success(`Re-Fix #${req.order_id} updated`);
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Re-Fix Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {requests.length} total &nbsp;•&nbsp;
            <span className="text-amber-400 font-semibold">{pending} pending</span>
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center text-muted-foreground">
          No re-fix requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const edit = edits[req.id] ?? { scheduledAt: "", adminNote: "" };
            const isSaving = saving === req.id;

            return (
              <div
                key={req.id}
                className="bg-[#111111] border border-[#262626] rounded-xl p-5 space-y-4 hover:border-white/10 transition-colors"
              >
                {/* Row header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm font-mono">
                        #{req.order_id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[req.status]}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{req.game_names}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(req.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Status selector */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleSave(req, e.target.value as RefixStatus)
                      }
                      disabled={isSaving}
                      className={`appearance-none text-xs font-bold px-3 py-1.5 pr-7 rounded-full border cursor-pointer bg-transparent focus:outline-none disabled:opacity-50 ${STATUS_COLORS[req.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#111111] text-white">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    {isSaving ? (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin opacity-60" />
                    ) : (
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    )}
                  </div>
                </div>

                {/* User's issue */}
                <div className="bg-white/5 rounded-lg px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Issue Reported
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed">{req.issue}</p>
                </div>

                {/* Admin controls */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Schedule date/time */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      <Calendar className="w-3 h-3" />
                      Schedule Fix
                    </label>
                    <input
                      type="datetime-local"
                      value={edit.scheduledAt}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [req.id]: { ...prev[req.id], scheduledAt: e.target.value },
                        }))
                      }
                      onBlur={() => handleSave(req, req.status)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {/* Admin note */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      <MessageSquare className="w-3 h-3" />
                      Note to User
                    </label>
                    <input
                      type="text"
                      value={edit.adminNote}
                      placeholder="e.g. Join WhatsApp call at 7pm"
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [req.id]: { ...prev[req.id], adminNote: e.target.value },
                        }))
                      }
                      onBlur={() => handleSave(req, req.status)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
