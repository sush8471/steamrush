/**
 * Supabase Database Types
 * Auto-generated types for type safety
 */

export interface Game {
    id: string;
    slug: string;
    steam_app_id: number | null;
    title: string;
    image_url: string;
    price: number;
    original_price: number | null;
    discount_percentage: number | null;
    genre: string[];
    tags: string[];
    series: string | null;
    description: string | null;
    is_available: boolean;
    stock_count: number;
    game_category: 'upcoming' | 'catalog';
    release_date: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface Bundle {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number;
    original_price: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    user_id: string;
    game_id: string;
    added_at: string;
    game?: Game; // Joined data
}

export interface Order {
    id: string;
    order_number: string;
    user_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    payment_screenshot_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    game_id: string | null;
    game_title: string;
    price_paid: number;
    created_at: string;
}
