#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const servePath = process.platform === "win32" ? `"${__dirname}"` : __dirname;

console.log("\n🚀 CaterTrack Admin - Iniciando...\n");

// Start local service
console.log("📡 Iniciando servicio local...");
const serviceProcess = spawn("node", [path.join(__dirname, "scripts/local-service.mjs")], {
  stdio: "inherit",
  detached: false,
  cwd: __dirname,
});

// Start HTTP server with serve
console.log("🌐 Iniciando servidor web...");
const serveProcess = spawn(npxCommand, ["--yes", "serve", servePath], {
  stdio: "inherit",
  detached: false,
  cwd: __dirname,
  shell: process.platform === "win32",
});

serviceProcess.on("error", (error) => console.error("Error iniciando el servicio local:", error.message));
serveProcess.on("error", (error) => console.error("Error iniciando el servidor web:", error.message));

// Wait for server to start, then show instructions
setTimeout(() => {
  console.log("\n✅ Sistema listo.\n");
  console.log("📍 Abre tu navegador en: http://localhost:3000/admin/\n");
  console.log("(El navegador debería abrirse automáticamente en algunos casos)\n");
}, 2000);

// Handle shutdown
process.on("SIGINT", () => {
  console.log("\n\n🛑 Cerrando CaterTrack Admin...");
  serviceProcess.kill();
  serveProcess.kill();
  process.exit(0);
});
