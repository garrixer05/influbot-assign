import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define:{
      'process.env.REACT_APP_CLIENT_KEY':JSON.stringify(env.REACT_APP_CLIENT_KEY),
      'process.env.REACT_APP_HOST':JSON.stringify(env.REACT_APP_HOST)
    },
    plugins: [react()]
  }
})
