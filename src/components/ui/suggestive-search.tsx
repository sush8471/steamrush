// SuggestiveSearch.tsx - Enhanced with game search functionality
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { GameData } from "@/data/games";

/**
 * Props for any effect renderer. Effects are responsible for animating the
 * provided `text` and invoking the lifecycle callbacks when phases complete.
 */
export interface EffectRendererProps {
  text: string;
  isActive: boolean;
  allowDelete?: boolean;
  typeDurationMs: number;
  deleteDurationMs: number;
  pauseAfterTypeMs: number;
  prefersReducedMotion?: boolean;
  onDeleteComplete?: () => void;
  containerRef?: RefObject<HTMLElement | null>;
}

/** Convenience union for built-in effects */
export type BuiltinEffect = "typewriter" | "slide" | "fade" | "none";

/** Props of the main SuggestiveSearch component */
export interface SuggestiveSearchProps {
  onChange?: (val: string) => void;
  suggestions?: string[];
  gameData?: GameData[]; // NEW: game catalogue data
  className?: string;
  placeholder?: string;
  Leading?: () => JSX.Element;
  showLeading?: boolean;
  Trailing?: () => JSX.Element;
  showTrailing?: boolean;
  effect?: BuiltinEffect;
  EffectComponent?: React.ComponentType<EffectRendererProps>;
  typeDurationMs?: number;
  deleteDurationMs?: number;
  pauseAfterTypeMs?: number;
  animateMode?: "infinite" | "once";
}

/* TypewriterEffect Component */
export const TypewriterEffect: React.FC<EffectRendererProps> = ({
  text,
  isActive,
  allowDelete = true,
  typeDurationMs,
  deleteDurationMs,
  pauseAfterTypeMs,
  prefersReducedMotion,
  onDeleteComplete,
  containerRef,
}) => {
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting">(
    "typing"
  );
  const timers = useRef<ReturnType<typeof window.setTimeout>[]>([]);

  useEffect(() => {
    setPhase("typing");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, isActive, allowDelete]);

  useEffect(() => {
    if (!isActive) {
      setPhase("typing");
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    if (prefersReducedMotion) {
      if (!allowDelete) return;
      const t = window.setTimeout(
        () => onDeleteComplete?.(),
        Math.max(200, pauseAfterTypeMs)
      );
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }
  }, [
    isActive,
    prefersReducedMotion,
    allowDelete,
    pauseAfterTypeMs,
    onDeleteComplete,
  ]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement> | undefined}
      style={{
        display: "inline-block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        alignItems: "center",
      }}
    >
      {prefersReducedMotion ? (
        <span className="text-sm text-muted-foreground select-none">
          {text}
        </span>
      ) : (
        <motion.div
          key={text}
          initial={{ width: "0%" }}
          animate={
            phase === "typing"
              ? { width: "100%" }
              : phase === "deleting"
              ? { width: "0%" }
              : { width: "100%" }
          }
          transition={
            phase === "typing"
              ? { duration: typeDurationMs / 1000, ease: "linear" }
              : phase === "deleting"
              ? { duration: deleteDurationMs / 1000, ease: "linear" }
              : {}
          }
          onAnimationComplete={() => {
            if (phase === "typing") {
              setPhase("paused");
              if (allowDelete) {
                const t = window.setTimeout(
                  () => setPhase("deleting"),
                  pauseAfterTypeMs
                );
                timers.current.push(t);
              }
            } else if (phase === "deleting") {
              onDeleteComplete?.();
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span className="text-sm text-muted-foreground select-none">
            {text}
          </span>

          {/* blinking cursor */}
          <motion.span
            aria-hidden
            style={{
              display: "inline-block",
              width: 1,
              marginLeft: 4,
              height: "1.1em",
              verticalAlign: "middle",
            }}
            className="bg-muted-foreground"
            animate={
              phase === "typing" || phase === "paused"
                ? { opacity: [0, 1, 0] }
                : { opacity: 0 }
            }
            transition={
              phase === "typing" || phase === "paused"
                ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                : { duration: 0.1 }
            }
          />
        </motion.div>
      )}
    </div>
  );
};

/* SuggestiveSearch Component with Game Search */
export const SuggestiveSearch: React.FC<SuggestiveSearchProps> = ({
  onChange,
  suggestions = ["Search GTA, Spider-Man, FIFA...", "Find your favorite games", "Try searching for 'cyberpunk'"],
  gameData = [],
  className,
  placeholder,
  Leading = () => <Search className="size-4 text-muted-foreground" />,
  showLeading = true,
  Trailing,
  showTrailing = false,
  effect = "typewriter",
  EffectComponent,
  typeDurationMs = 600,
  deleteDurationMs = 400,
  pauseAfterTypeMs = 2000,
  animateMode = "infinite",
}) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [index, setIndex] = useState<number>(0);
  const current = useMemo(() => suggestions[index] ?? "", [suggestions, index]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const leadingRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trailingRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [leftOffsetPx, setLeftOffsetPx] = useState<number | null>(null);
  const [rightOffsetPx, setRightOffsetPx] = useState<number | null>(null);

  // Fuzzy search logic
  const filteredGames = useMemo(() => {
    if (!search.trim() || !gameData.length) return [];

    const query = search.toLowerCase().trim();
    const scored = gameData.map((game) => {
      const title = game.title.toLowerCase();
      let score = 0;

      // Exact match
      if (title === query) score += 1000;
      
      // Starts with
      if (title.startsWith(query)) score += 500;
      
      // Word starts
      const words = title.split(/\s+/);
      if (words.some(w => w.startsWith(query))) score += 300;
      
      // Abbreviation match (e.g., "gt" → "Grand Theft")
      const initials = words.map(w => w[0]).join("");
      if (initials.includes(query)) score += 250;
      
      // Character sequence
      let queryIndex = 0;
      for (let i = 0; i < title.length && queryIndex < query.length; i++) {
        if (title[i] === query[queryIndex]) queryIndex++;
      }
      if (queryIndex === query.length) score += 200;
      
      // Contains
      if (title.includes(query)) score += 100;

      return { game, score };
    });

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ game }) => game);
  }, [search, gameData]);

  // Measure offsets
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lead = leadingRef.current;
    const trail = trailingRef.current;
    if (!wrapper) return;

    const update = () => {
      const cs = getComputedStyle(wrapper);
      const padLeft = parseFloat(cs.paddingLeft || "0");
      const padRight = parseFloat(cs.paddingRight || "0");
      const leadW = showLeading ? lead?.getBoundingClientRect().width ?? 0 : 0;
      const trailW = showTrailing
        ? trail?.getBoundingClientRect().width ?? 0
        : 0;
      const left = padLeft + leadW + 8;
      setLeftOffsetPx(left);
      const right = padRight + trailW;
      setRightOffsetPx(right);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    if (lead) ro.observe(lead);
    if (trail) ro.observe(trail);
    return () => ro.disconnect();
  }, [showLeading, showTrailing]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults || filteredGames.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredGames.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && filteredGames[selectedIndex]) {
            handleSelectGame(filteredGames[selectedIndex]);
          }
          break;
        case "Escape":
          setShowResults(false);
          setSelectedIndex(-1);
          break;
      }
    };

    if (showResults) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showResults, selectedIndex, filteredGames]);

  const builtinMap: Record<BuiltinEffect, React.ComponentType<any>> = {
    typewriter: TypewriterEffect,
    slide: TypewriterEffect,
    fade: TypewriterEffect,
    none: () => null,
  };
  const ChosenEffect = EffectComponent ?? builtinMap[effect];

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleEffectDeleteComplete() {
    setIndex((i) => (i + 1) % suggestions.length);
  }

  const handleInputChange = (val: string) => {
    setSearch(val);
    onChange?.(val);
    setShowResults(val.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleSelectGame = (game: GameData) => {
    router.push(`/games/${game.id}`);
    setSearch("");
    setShowResults(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearch("");
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const overlayActive = !search && !isFocused;
  const isLast = index === suggestions.length - 1;
  const allowDelete = animateMode === "infinite" ? true : !isLast;

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={cn(
          "relative flex items-center gap-x-2 py-2 px-4 border border-border rounded-full bg-[#1A1F3A]/50 backdrop-blur-sm",
          isFocused && "ring-2 ring-[#0074E4]/50",
          className
        )}
      >
        {/* Leading icon */}
        <div ref={leadingRef} className="flex-shrink-0">
          {showLeading && <Leading />}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={search}
          onFocus={() => {
            setIsFocused(true);
            if (search.trim()) setShowResults(true);
          }}
          onBlur={() => {
            // Delay to allow click on results
            setTimeout(() => setIsFocused(false), 200);
          }}
          onChange={(e) => handleInputChange(e.target.value)}
          className="bg-transparent outline-none text-sm text-white placeholder:text-transparent w-full"
          placeholder={placeholder || ""}
          aria-label="search games"
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 hover:bg-white/10 rounded-full p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-[#B0B8D0]" />
          </button>
        )}

        {/* Trailing icon */}
        {showTrailing && Trailing && (
          <div ref={trailingRef} className="flex-shrink-0">
            <Trailing />
          </div>
        )}

        {/* Animated overlay */}
        {overlayActive && (
          <div
            ref={overlayRef}
            aria-hidden
            style={{
              position: "absolute",
              left: leftOffsetPx != null ? `${leftOffsetPx}px` : "calc(0.5rem + 1.5rem + 8px)",
              right: rightOffsetPx != null ? `${rightOffsetPx}px` : "0.5rem",
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <ChosenEffect
              text={current}
              isActive={overlayActive}
              allowDelete={allowDelete}
              typeDurationMs={typeDurationMs ?? 600}
              deleteDurationMs={deleteDurationMs ?? 400}
              pauseAfterTypeMs={pauseAfterTypeMs ?? 2000}
              prefersReducedMotion={prefersReduced}
              onDeleteComplete={handleEffectDeleteComplete}
              containerRef={overlayRef}
            />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && filteredGames.length > 0 && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto"
        >
          {filteredGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => handleSelectGame(game)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0",
                selectedIndex === idx && "bg-white/10"
              )}
            >
              <Image
                src={game.image}
                alt={game.title}
                width={60}
                height={80}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">{game.title}</p>
                <p className="text-[#B0B8D0] text-xs">{game.type}</p>
              </div>
              <div className="text-right">
                <p className="text-[#0074E4] font-bold text-sm">{game.price}</p>
                {game.discount && (
                  <p className="text-[#25D366] text-xs">{game.discount}</p>
                )}
              </div>
            </button>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {showResults && search.trim() && filteredGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl p-6 text-center z-50"
        >
          <p className="text-[#B0B8D0] mb-3">No games found for "{search}"</p>
          <a
            href="/games"
            className="text-[#0074E4] hover:underline text-sm"
          >
            Browse all games →
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default SuggestiveSearch;
