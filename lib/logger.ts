/**
 * Dev-gated logger — debug logs stay out of production builds.
 * console.error passes through always (real failures must surface).
 */
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
