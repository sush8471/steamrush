import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');

  if (!appId) {
    return NextResponse.json(
      { error: 'App ID is required' },
      { status: 400 }
    );
  }

  try {
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=IN&l=english`;
    
    const response = await fetch(steamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Steam API returned ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching from Steam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data from Steam' },
      { status: 500 }
    );
  }
}
