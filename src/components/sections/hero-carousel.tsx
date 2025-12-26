"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface HeroSlide {
  id: number;
  title: string;
  description?: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "The most affordable Steam game store for India",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/egs-holidaysale-freegame-fn-gwp-desktop-carousel-a-4.jpg",
  },
  {
    id: 2,
    title: "Original Steam games only",
    description: "No cracked or pirated content",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/egs-fortnite-og-1s7-carousel-desktop-1920x1080-e6e-5.jpg",
  },
  {
    id: 3,
    title: "Pay via UPI • Delivered via WhatsApp • Human support",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/tga25-desktop-carousel-asset1-1920x1080-c6daf34be1-6.png",
  },
  {
    id: 4,
    title: "Curated combo deals at unbeatable prices",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/egs-battlefield-6-carousel-desktop-1248x702-87c428-7.jpg",
  },
  {
    id: 5,
    title: "Quick setup • No waiting • Easy process",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/egs-out-of-words-flying-carousel-1920x1080-628cc4b-8.jpg",
  },
  {
    id: 6,
    title: "Trusted by Indian gamers nationwide",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/egs-ea-fc-26-carousel-desktop-1920x1080-cebdf43100-9.jpg",
  },
];

const AUTO_SLIDE_INTERVAL = 6000;

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<number>(0);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    progressRef.current = 0;
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      
      progressRef.current = Math.min(elapsed / AUTO_SLIDE_INTERVAL, 1);

      if (elapsed >= AUTO_SLIDE_INTERVAL) {
        nextSlide();
        startTimeRef.current = time;
        progressRef.current = 0;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, nextSlide, currentIndex]);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    progressRef.current = 0;
    startTimeRef.current = null;
  };

  return (
    <section className="relative w-full bg-[#0A0E27] font-sans overflow-hidden py-6 lg:py-10">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 xl:px-12">
        
        <div 
          className="relative aspect-[16/9] lg:aspect-[21/9] w-full group rounded-2xl overflow-hidden shadow-2xl bg-[#1A1F3A]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 1600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center lg:justify-start p-6 lg:p-16 z-20">
                <div className="max-w-3xl text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-4">
                    {slide.title}
                  </h2>
                  {slide.description && (
                    <p className="text-lg lg:text-2xl text-[#E0E0E0] drop-shadow-lg font-light">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className="flex justify-center items-center gap-3 mt-6">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => handleSlideChange(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-10 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
