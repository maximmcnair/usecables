import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      '$comps': 'src/comps',
      '$types': 'src/types.ts',
      '$lib': 'src/lib',
      '$routes': 'src/routes',
      '$stores': 'src/stores',
    }
  }
};

export default config;
