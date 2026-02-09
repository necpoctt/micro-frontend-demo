import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          //  告訴 Vue 這些是 Web Components
          isCustomElement: (tag) => tag.includes('remote-'),
        },
      },
    }),
  ],
});
