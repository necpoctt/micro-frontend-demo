// react-chart-lib/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 新增這段 define 設定
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'ReactChartLib',
      fileName: 'react-chart-lib',
    },
    rollupOptions: {
      // 確保將 React 相關套件打包進去 (因為是獨立運作的 Web Component)
      // 如果你之前設定了 external，請移除，讓它包含在 bundle 中
      external: [],
      output: {
        globals: {
          // 如果沒有 external，這裡其實不需要，但保留無妨
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'react-chart-lib.css';
          return assetInfo.name || '[name][extname]';
        },
      },
    },
  },
});
