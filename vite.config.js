import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",  // or true
    port: 5173,         // 👈 change to 5173
    open: "/",          // 👈 open the root, not /callback
  },
  // make sure there's NO base: "/callback" here; if you see it, remove or set base: "/"
  // base: "/",
});
