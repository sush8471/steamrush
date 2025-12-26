export interface GameData {
  id: number;
  title: string;
  image: string;
  price: string;
  originalPrice: string;
  discount: string;
  type: string;
  description: string;
}

// Sample of popular games for search
export const SEARCH_GAMES: GameData[] = [
  { id: 6, title: "Grand Theft Auto V", image: "/gta-v.jpg", price: "₹299", originalPrice: "₹899", discount: "-67%", type: "Action-Adventure / Open-World", description: "Crime spree across Los Santos" },
  { id: 5, title: "Grand Theft Auto IV: Complete Edition", image: "/gta-iv.png", price: "₹199", originalPrice: "₹899", discount: "-78%", type: "Action-Adventure / Open-World", description: "Niko Bellic's story in Liberty City" },
  { id: 8, title: "Marvel's Spider-Man Remastered", image: "/spiderman-remastered.png", price: "₹249", originalPrice: "₹1,299", discount: "-81%", type: "Action-Adventure / Open-World", description: "Swing through New York as Spider-Man" },
  { id: 9, title: "Marvel's Spider-Man 2", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891423972.png?width=8000&height=8000&resize=contain", price: "₹299", originalPrice: "₹1,499", discount: "-80%", type: "Action-Adventure / Open-World", description: "Play as both Peter Parker and Miles Morales" },
  { id: 10, title: "Marvel's Spider-Man: Miles Morales", image: "/spiderman-miles-morales.png", price: "₹249", originalPrice: "₹999", discount: "-75%", type: "Action-Adventure / Open-World", description: "Miles Morales takes on new villains" },
  { id: 7, title: "Red Dead Redemption 2", image: "/red-dead-redemption-2.jpg", price: "₹299", originalPrice: "₹899", discount: "-67%", type: "Action-Adventure / Open-World", description: "Epic Western adventure in stunning open world" },
  { id: 32, title: "Cyberpunk 2077", image: "/cyberpunk-2077.jpg", price: "₹299", originalPrice: "₹1,299", discount: "-77%", type: "FPS / TPS", description: "Futuristic RPG set in Night City" },
  { id: 35, title: "Elden Ring", image: "/elden-ring.jpg", price: "₹299", originalPrice: "₹1,499", discount: "-80%", type: "RPG", description: "Massive fantasy world from FromSoftware" },
  { id: 14, title: "God of War", image: "/god-of-war.jpg", price: "₹299", originalPrice: "₹899", discount: "-67%", type: "Action-Adventure / Open-World", description: "Norse mythology meets brutal action" },
  { id: 15, title: "God of War Ragnarök", image: "/god-of-war-ragnarok.jpg", price: "₹299", originalPrice: "₹1,499", discount: "-80%", type: "Action-Adventure / Open-World", description: "Kratos and Atreus face Ragnarök" },
  { id: 193, title: "Hogwarts Legacy", image: "/hogwarts-legacy.jpg", price: "₹349", originalPrice: "₹1,999", discount: "-83%", type: "Action-Adventure / Open-World", description: "Experience magic at Hogwarts in 1800s" },
  { id: 158, title: "Assassin's Creed Valhalla", image: "/ac-valhalla.jpg", price: "₹279", originalPrice: "₹1,499", discount: "-81%", type: "Action-Adventure / Open-World", description: "Viking conquest of England" },
  { id: 157, title: "Assassin's Creed Mirage", image: "/ac-mirage.jpg", price: "₹299", originalPrice: "₹1,699", discount: "-82%", type: "Action-Adventure / Open-World", description: "Return to the roots of Assassins" },
  { id: 161, title: "Far Cry 6", image: "/far-cry-6.jpg", price: "₹269", originalPrice: "₹1,299", discount: "-79%", type: "Action-Adventure / Open-World", description: "Fight dictator in tropical paradise" },
  { id: 162, title: "Far Cry 5", image: "/far-cry-5.jpg", price: "₹239", originalPrice: "₹1,199", discount: "-80%", type: "Action-Adventure / Open-World", description: "Cult warfare in Montana" },
  { id: 189, title: "Black Myth: Wukong", image: "/black-myth-wukong.jpg", price: "₹299", originalPrice: "₹1,899", discount: "-84%", type: "Action-Adventure / Open-World", description: "Journey to the West inspired action RPG" },
  { id: 93, title: "FC 25", image: "/fc-25.jpg", price: "₹349", originalPrice: "₹1,999", discount: "-83%", type: "Sports", description: "The latest FIFA experience" },
  { id: 94, title: "FC 24", image: "/fc-24.jpg", price: "₹299", originalPrice: "₹1,799", discount: "-83%", type: "Sports", description: "Previous year's FIFA" },
  { id: 138, title: "NBA 2K25", image: "/nba-2k25.jpg", price: "₹329", originalPrice: "₹1,899", discount: "-83%", type: "Sports", description: "Latest basketball simulation" },
  { id: 66, title: "Mortal Kombat 1", image: "/mortal-kombat-1.png", price: "₹329", originalPrice: "₹1,899", discount: "-83%", type: "Fighting", description: "Rebooted fighting game universe" },
];
