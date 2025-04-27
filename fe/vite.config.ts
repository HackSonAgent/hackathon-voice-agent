import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    TanStackRouterVite(),
    // Add static copy plugin to copy VAD files
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
          dest: '',
        },
        {
          src: 'node_modules/@ricky0123/vad-web/dist/*.onnx',
          dest: '',
        },
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: '',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
})
