import createCache from '@emotion/cache';
import type { Options } from '@emotion/cache';

export default function createEmotionCache(options?: Options) {
  return createCache({ ...options, prepend: true, key: 'css' });
}