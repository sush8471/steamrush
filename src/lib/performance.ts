/**
 * Performance Optimization Utilities
 * Helper functions for improving app performance
 */

/**
 * Debounce function to limit how often a function can fire
 * Useful for search inputs, scroll handlers, resize events
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure a function runs at most once per specified time
 * Useful for scroll handlers, mouse move events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Lazy load images when they enter viewport
 * Returns IntersectionObserver for image lazy loading
 */
export function createImageObserver(
    callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(entry);
            }
        });
    }, options);
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if code is running on client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Get optimal image size based on viewport
 */
export function getOptimalImageSize(): 'small' | 'medium' | 'large' {
    if (!isClient) return 'medium';

    const width = window.innerWidth;
    if (width < 768) return 'small';
    if (width < 1280) return 'medium';
    return 'large';
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Measure component render time (development only)
 */
export function measureRenderTime(componentName: string, callback: () => void) {
    if (process.env.NODE_ENV === 'development') {
        const start = performance.now();
        callback();
        const end = performance.now();
        console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
    } else {
        callback();
    }
}

/**
 * Create a simple LRU cache
 */
export class LRUCache<K, V> {
    private max: number;
    private cache: Map<K, V>;

    constructor(max = 10) {
        this.max = max;
        this.cache = new Map();
    }

    get(key: K): V | undefined {
        const item = this.cache.get(key);
        if (item) {
            // Refresh key
            this.cache.delete(key);
            this.cache.set(key, item);
        }
        return item;
    }

    set(key: K, val: V): void {
        // Refresh key
        if (this.cache.has(key)) this.cache.delete(key);
        // Evict oldest
        else if (this.cache.size === this.max) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, val);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.clear();
    }
}
