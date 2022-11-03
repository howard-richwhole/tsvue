import path from 'path'
import mock from './mock'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json'
import { defineConfig,loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode,process.cwd())
  return {
    plugins: [vue(),
      mock(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            version: packageJson.version,
            title: env.VITE_TITLE,
          },
        },
      }),],
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'src')
      }
    },
    server: {
      port: 3000,
      open: false,
      host: true,
      proxy: {
        '^/api': {
          target: 'http://api.hbo13.com/service',
          changeOrigin: true,
        },
      },
    },
  }
})
