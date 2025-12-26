<file_path>
src/components/sections/featured-content-gta.tsx
</file_path>

<content>
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedContentGTA() {
  return (
    <section className="w-full bg-[#0A0E27] py-12 text-white">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1: Grand Theft Auto Online */}
          <Link
            href="/p/grand-theft-auto-online"
            className="group block"
            aria-label="Grand Theft Auto Online"
          >
            <div className="flex h-full flex-col gap-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-[#1A1F3A] shadow-lg transition-transform duration-300 ease-out group-hover:translate-y-[-4px] group-hover:shadow-2xl group-hover:brightness-110">
                <Image
                  src="https://cdn2.unrealengine.com/grand-theft-auto-online-3840x2160-c752ba2c24c7.jpg?resize=1&w=854&h=480&quality=medium"
                  alt="Grand Theft Auto Online"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 700px, 100vw"
                  priority
                />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-bold leading-tight tracking-wide text-white group-hover:text-[#00B4FF]">
                  Grand Theft Auto Online
                </h3>
                <p className="line-clamp-2 max-w-[90%] font-body text-base text-[#B0B8D0] group-hover:text-white/90">
                  Experience a brand-new Los Santos adventure.
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center justify-center rounded-[4px] bg-[#00B4FF] px-2 py-0.5 font-mono text-sm font-bold text-white">
                    -50%
                  </span>
                  <span className="font-body text-sm font-medium text-[#B0B8D0] line-through">
                    $29.99
                  </span>
                  <span className="font-body text-base font-bold text-white">
                    $14.99
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Gifting */}
          <div className="flex h-full flex-col gap-6">
            <Link
              href="/p/gifting"
              className="group relative block aspect-video w-full overflow-hidden rounded-[16px] bg-[#1A1F3A] shadow-lg transition-transform duration-300 ease-out hover:translate-y-[-4px] hover:shadow-2xl hover:brightness-110"
              aria-label="Gifting on the Epic Games Store"
            >
              <Image
                src="https://cdn2.unrealengine.com/egs-gifting-breaker-2560x1440-410a006c7476.jpg?resize=1&w=854&h=480&quality=medium"
                alt="Gifting on the Epic Games Store"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 700px, 100vw"
              />
            </Link>

            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col gap-2">
                <Link
                  href="/p/gifting"
                  className="font-display text-xl font-bold leading-tight tracking-wide text-white transition-colors hover:text-[#00B4FF]"
                >
                  Gifting on the Epic Games Store
                </Link>
                <p className="max-w-[95%] font-body text-base leading-relaxed text-[#B0B8D0]">
                  Send games and add-ons to your friends, earn Epic Rewards with
                  every purchase, or use your balance toward the next gift you
                  give. Restrictions apply.
                </p>
              </div>
              <Link
                href="/p/gifting"
                className="mt-1 inline-flex items-center justify-center rounded-[4px] border border-white/20 px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
</content>