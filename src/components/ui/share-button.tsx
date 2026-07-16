"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  slug: string;
  className?: string;
  iconOnly?: boolean;
}

export default function ShareButton({ title, slug, className = "", iconOnly = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/games/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Gamer Bhidu`,
          text: `Check out ${title} on Gamer Bhidu!`,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={className}
      aria-label={copied ? "Link copied" : "Share game"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
      {!iconOnly && <span>{copied ? "Copied!" : "Share"}</span>}
    </button>
  );
}
