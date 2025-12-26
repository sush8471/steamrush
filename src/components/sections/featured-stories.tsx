import Image from "next/image";
import Link from "next/link";
import { Copy } from "lucide-react";

interface Story {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
}

const stories: Story[] = [
  {
    id: "1",
    image: "https://cdn2.unrealengine.com/egs-last-flag-story-thumb-1920x1080-60b540106263.jpg?resize=1&w=854&h=480&quality=medium", 
    // Fallback: https://placehold.co/854x480/2D3748/FFFFFF?text=Back+to+the+neighborhood
    title: "Back to the neighborhood",
    description: "Last Flag explores the roots of Capture the Flag, bringing the childhood game to PC in a retro-infused multiplayer game.",
    link: "/en-US/news/last-flag-capture-the-flag-roots",
  },
  {
    id: "2",
    image: "https://cdn2.unrealengine.com/egs-super-meat-boy-forever-story-thumb-1920x1080-872017772274.jpg?resize=1&w=854&h=480&quality=medium",
    // Fallback: https://placehold.co/854x480/2D3748/FFFFFF?text=A+new+dimension
    title: "A new dimension",
    description: "How Super Meat Boy 3D mutates the ultra hard and abundantly gory platform series from 2D to 3D.",
    link: "/en-US/news/super-meat-boy-forever-3d-interview",
  },
  {
    id: "3",
    image: "https://cdn2.unrealengine.com/egs-generic-editorial-thumb-1920x1080-305370243467.jpg?resize=1&w=854&h=480&quality=medium",
    // Fallback: https://placehold.co/854x480/2D3748/FFFFFF?text=A+wealth+of+stories
    title: "A wealth of stories",
    description: "Plug into our drip feed of exclusives, features, interviews, and guides.",
    link: "/en-US/news",
  },
];

export default function FeaturedStories() {
  return (
    <section className="w-full bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-[18px] md:text-[20px] font-bold tracking-normal text-white">
            Featured Stories
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col group cursor-pointer h-full">
              {/* Image Container */}
              <div className="relative w-full aspect-[16/9] mb-6 overflow-hidden rounded-[12px] bg-card border border-border/10 shadow-sm transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-lg group-hover:brightness-110">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback handled via src construction logic or interceptor in real app
                    // Here we assume the provided URLs or placeholders work
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/854x480/2D3748/FFFFFF?text=${encodeURIComponent(story.title)}`;
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-[16px] md:text-[18px] font-bold text-white mb-2 leading-tight transition-colors group-hover:text-primary">
                  {story.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                  {story.description}
                </p>
                
                {/* CTA Button */}
                <div className="mt-auto">
                  <span
                    className="
                      inline-flex items-center justify-center
                      h-[32px] px-4
                      text-[12px] font-bold uppercase tracking-wider
                      text-white bg-secondary hover:bg-[#5A6578]
                      rounded-[4px]
                      transition-colors duration-200
                    "
                  >
                    Read More
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}