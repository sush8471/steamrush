"use client";

import { useState } from "react";
import { X, Wrench, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { submitRefixRequest, type RefixRequest } from "@/lib/db/refix-db";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Ticket submitted — we'll reach out soon", color: "text-amber-400"  },
  scheduled: { label: "Fix scheduled! Check the time below.",     color: "text-blue-400"  },
  resolved:  { label: "Issue resolved ✓",                          color: "text-green-400" },
  closed:    { label: "Ticket closed",                              color: "text-muted-foreground" },
};

interface RefixModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  orderId: string;       // SR12345678
  gameNames: string;     // comma-separated game names from order snapshot
  existingRequest?: RefixRequest | null;
}

export function RefixModal({
  open,
  onClose,
  userId,
  orderId,
  gameNames,
  existingRequest,
}: RefixModalProps) {
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<RefixRequest | null>(
    existingRequest ?? null
  );

  if (!open) return null;

  const handleSubmit = async () => {
    if (issue.trim().length < 20) {
      toast.error("Please describe the issue in at least 20 characters.");
      return;
    }
    setSubmitting(true);
    const result = await submitRefixRequest(userId, orderId, gameNames, issue.trim());
    setSubmitting(false);

    if (result) {
      setSubmitted(result);
      toast.success("Re-Fix request submitted! We'll schedule a time soon.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const statusInfo = submitted ? STATUS_LABELS[submitted.status] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Request Re-Fix</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Order reference */}
          <div className="bg-white/5 rounded-lg px-4 py-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order</p>
            <p className="text-sm font-bold text-white">#{orderId}</p>
            <p className="text-xs text-muted-foreground">{gameNames}</p>
          </div>

          {/* If already submitted — show status */}
          {submitted ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                {submitted.status === "resolved" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className={`text-sm font-semibold ${statusInfo?.color}`}>
                    {statusInfo?.label}
                  </p>
                  {submitted.scheduled_at && (
                    <p className="text-xs text-muted-foreground">
                      Scheduled:{" "}
                      <span className="text-white font-medium">
                        {new Date(submitted.scheduled_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </p>
                  )}
                  {submitted.admin_note && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-white/60 font-medium">Admin note: </span>
                      {submitted.admin_note}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your issue: <span className="text-white/70">{submitted.issue}</span>
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Describe the issue <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. The game crashes on launch after the latest Windows update. I followed the original guide but it shows an error..."
                  rows={5}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
                <p className={`text-[10px] mt-1 ${issue.length < 20 && issue.length > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {issue.length}/20 min characters
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                After submitting, we'll review your request and reach out via WhatsApp to schedule a fix session.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white text-sm font-medium transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || issue.trim().length < 20}
                  className="flex-1 py-3 rounded-xl bg-amber-500/90 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
