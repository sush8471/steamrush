import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appid');

    if (!appId) {
        return NextResponse.json(
            { error: 'App ID is required' },
            { status: 400 }
        );
    }

    try {
        // Fetch from Steam Store API
        const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=in&l=english`;

        const response = await fetch(steamUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Steam API returned ${response.status}`);
        }

        const data = await response.json();

        // Check if the game data exists
        if (!data[appId] || !data[appId].success) {
            return NextResponse.json(
                { error: 'Game not found on Steam' },
                { status: 404 }
            );
        }

        return NextResponse.json(data[appId].data);
    } catch (error) {
        console.error('Steam API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch game data from Steam' },
            { status: 500 }
        );
    }
}
