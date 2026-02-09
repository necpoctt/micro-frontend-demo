// vue-table-lib/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
export default defineConfig({
  plugins: [vue()],
  // 新增這段 define 設定
  resolve: {
    alias: {
      // 1. 基本的 @ 對應 src
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'VueTableLib',
      fileName: 'vue-table-lib',
    },
    rollupOptions: {
      // 同樣確保 Vue 被打包進去
      external: [],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // [關鍵] 自動引入 variables.scss，讓全域都能用
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});
