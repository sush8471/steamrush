import Image from "next/image";
import Link from "next/link";

const PROMOTIONAL_BREAKERS = [
  {
    id: "holiday-sale",
    href: "/sales-and-specials/holiday-sale",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/en-holiday-sale-3up-a-breaker-asset-1920x1080-c064-1.jpg",
    alt: "Holiday Sale - December 11 - January 8",
  },
  {
    id: "rewards-boosted",
    href: "/features/epic-rewards",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/en-holiday-sale-3up-b-breaker-asset-1920x1080-d57f-2.jpg",
    alt: "Rewards Boosted to 20%",
  },
  {
    id: "epic-extras",
    href: "/free-games",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/en-holiday-sale-3up-c-breaker-asset-1920x1080-df2e-3.jpg",
    alt: "Epic Extras - Free Packs, Trials and More",
  },
];

export default function PromotionalBreakers() {
  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
          {PROMOTIONAL_BREAKERS.map((breaker) => (
            <Link
              key={breaker.id}
              href={breaker.href}
              className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <Image
                src={breaker.image}
                alt={breaker.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
                className="object-cover transition-transform duration-300 group-hover:brightness-110"
                priority
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}