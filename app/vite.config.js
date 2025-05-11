import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {nodePolyfills} from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


// https://vitejs.dev/config/
export default defineConfig({
    publicPath: '/public',
    plugins: [
        vue(),
        topLevelAwait(),
        nodePolyfills({
            protocolImports: true,
        }),
        wasm(),
    ],
    server: {
        port: 4000,
        host: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'crypto': 'crypto-browserify',
            'stream': 'stream-browserify',
            'assert': 'assert',
            'process': 'process/browser',
            'util': 'util',
        }
    },
    optimizeDeps: {
        include: ['bignumber.js'],
        exclude: [
            "@syntect/wasm"
        ],
        esbuildOptions: {
            // format: 'cjs'
            format: 'esm'
        }
    }
})
