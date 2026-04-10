// // @ts-check
// import { defineConfig } from 'astro/config';

// import vue from '@astrojs/vue';

// import tailwindcss from '@tailwindcss/vite';

// // https://astro.build/config
// export default defineConfig({
//   integrations: [vue()],

//   vite: {
//     plugins: [tailwindcss()]
//   }
// });

import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});