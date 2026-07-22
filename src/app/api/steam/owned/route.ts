import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const steamId = searchParams.get("steamId");

  if (!steamId) {
    return NextResponse.json(
      { error: "Steam ID is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.STEAM_API_KEY;
    let ownedGames: Array<{ appId: number; name: string; playtimeMinutes: number }> = [];

    // 1. Try Official Steam Web API
    if (apiKey) {
      const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
      const res = await fetch(url, { next: { revalidate: 300 } });

      if (res.ok) {
        const json = await res.json();
        const games = json?.response?.games || [];

        if (games.length > 0) {
          ownedGames = games.map((g: any) => ({
            appId: g.appid,
            name: g.name,
            playtimeMinutes: g.playtime_forever || 0,
          }));
        }
      }
    }

    // 2. Fallback: If 0 games returned, try public Steam Community Games XML endpoint
    if (ownedGames.length === 0) {
      const xmlUrl = `https://steamcommunity.com/profiles/${steamId}/games?tab=all&xml=1`;
      const xmlRes = await fetch(xmlUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 300 },
      });

      if (xmlRes.ok) {
        const xmlText = await xmlRes.text();
        const gameBlocks = xmlText.split("<game>");

        for (const block of gameBlocks.slice(1)) {
          const appIdMatch = block.match(/<appID>(\d+)<\/appID>/);
          const nameMatch =
            block.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) ||
            block.match(/<name>(.*?)<\/name>/);
          const hoursMatch = block.match(/<hoursOnRecord>([\d\.]+)<\/hoursOnRecord>/);

          if (appIdMatch) {
            const appId = parseInt(appIdMatch[1], 10);
            const name = nameMatch ? nameMatch[1] : `App ${appId}`;
            const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;

            ownedGames.push({
              appId,
              name,
              playtimeMinutes: Math.round(hours * 60),
            });
          }
        }
      }
    }

    const appIds = ownedGames.map((g) => g.appId);

    return NextResponse.json({
      success: true,
      count: ownedGames.length,
      appIds,
      games: ownedGames,
      isGameDetailsPrivate: ownedGames.length === 0,
    });
  } catch (error) {
    console.error("[Steam Owned Proxy Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch owned Steam games" },
      { status: 500 }
    );
  }
}
