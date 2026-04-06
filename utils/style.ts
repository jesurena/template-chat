

/**
 * Returns a line-clamp class based on the number of items being displayed.
 * Helps to fill space when fewer items are shown.
 */
export function getLineClamp(count: number): string {
    if (count <= 1) return 'line-clamp-6';
    if (count === 2) return 'line-clamp-4';
    return 'line-clamp-3';
}
