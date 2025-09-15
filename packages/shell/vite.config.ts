/* eslint-disable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// URLs de produção para deploy na Vercel
const PRODUCTION_URLS = {
  authMfe: "https://auth-bgb7jbv4d-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js",
  clientsMfe: "https://clients-3xpydirc8-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js",
  designSystem: "https://design-system-five-hazel.vercel.app/assets/remoteEntry.js"
};

const DEVELOPMENT_URLS = {
  authMfe: "http://localhost:5174/assets/remoteEntry.js",
  clientsMfe: "http://localhost:5175/assets/remoteEntry.js",
  designSystem: "http://localhost:5176/assets/remoteEntry.js"
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const remoteUrls = isProduction ? PRODUCTION_URLS : DEVELOPMENT_URLS;
  
  return {
    plugins: [react(),
      federation({
        name: "shell",
        remotes: remoteUrls,
        shared: ["react", "react-dom", "react-router-dom"]
      })
    ],
    build: {
      target: 'esnext',
      minify: isProduction,
      cssCodeSplit: false,
      modulePreload: false,
      rollupOptions: {
        external: isProduction ? [] : undefined
      }
    },
    server: {
      port: 5173,
      cors: true,
      fs: {
        allow: ['..', '../..']
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    preview: {
      port: 5173,
      cors: true
    }
  };
});