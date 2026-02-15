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

    console.log('🔍 Fetching Steam data for App ID:', appId);
    console.log('🌐 Steam URL:', steamUrl);

    const response = await fetch(steamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    console.log('📡 Steam API Response Status:', response.status);

    if (!response.ok) {
      console.error('❌ Steam API returned non-OK status:', response.status);
      throw new Error(`Steam API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Steam API Response received for App ID:', appId);
    console.log('📦 Response data keys:', Object.keys(data));

    if (data[appId]) {
      console.log('✅ Game data found for App ID:', appId);
      console.log('📊 Success:', data[appId].success);
    } else {
      console.warn('⚠️ No data found for App ID:', appId);
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching from Steam:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch game data from Steam', details: error.message },
      { status: 500 }
    );
  }
}
