/**
 * sleep
 * @param m milliseconds
 * @returns Promise
 */
export const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
