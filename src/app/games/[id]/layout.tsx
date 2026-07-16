import type { Metadata } from "next";
import { getGameBySlug } from "@/lib/local-db";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getGameBySlug(id);

  if (!data) {
    return {
      title: "Game Not Found | Gamer Bhidu",
    };
  }

  const title = `${data.title} | Gamer Bhidu`;
  const description = data.description
    ? data.description.slice(0, 160)
    : `Buy ${data.title} at the best price. Original Steam games files, instant delivery.`;
  const imageUrl = data.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://gamerbhidu.com/games/${id}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: data.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default function GameDetailLayout({ children }: Props) {
  return <>{children}</>;
}
