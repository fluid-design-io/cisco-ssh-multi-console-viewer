export const storage = typeof window !== 'undefined' ? (window.localStorage as Storage) : null;
