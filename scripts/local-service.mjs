import http from "node:http";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import url from "node:url";

const PORT = 9999;
const root = path.dirname(url.fileURLToPath(import.meta.url)) + "/..";
const allowedCommands = new Set(["build", "publish"]);

const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);
const error = (message) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`);

const execute = (command, cwd = root) => {
  try {
    return { success: true, output: execSync(command, { cwd, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }).trim() };
  } catch (err) {
    return { success: false, output: err.stderr?.toString()?.trim() || err.toString() };
  }
};

const handlePublish = async () => {
  log("Iniciando publicación...");
  const steps = [];

  // Step 1: Build catalog
  log("Generando catálogo...");
  const buildResult = execute("npm run build");
  if (!buildResult.success) {
    error("Build falló: " + buildResult.output);
    return { success: false, error: "Build falló", details: buildResult.output, steps };
  }
  steps.push({ step: "Generador ejecutado", status: "✓" });
  log("Build completado.");

  // Step 2: Check for changes
  log("Verificando cambios...");
  const statusResult = execute("git status --porcelain");
  if (!statusResult.success) {
    error("No se pudo verificar cambios: " + statusResult.output);
    return { success: false, error: "Git error", details: statusResult.output, steps };
  }

  const changes = statusResult.output.trim();
  if (!changes) {
    log("Sin cambios para publicar.");
    return { success: false, error: "Sin cambios", details: "No hay cambios nuevos que publicar.", steps, noChanges: true };
  }

  const changedFiles = changes.split("\n").length;
  steps.push({ step: `${changedFiles} archivo(s) modificado(s)`, status: "✓" });
  log(`Detectados ${changedFiles} cambios.`);

  // Step 3: Validate generated files
  log("Validando archivos generados...");
  const sitemapPath = path.join(root, "generated/sitemap.xml");
  const catalogPath = path.join(root, "generated/catalog-data.js");
  if (!fs.existsSync(sitemapPath) || !fs.existsSync(catalogPath)) {
    error("Archivos generados no encontrados");
    return { success: false, error: "Validación falló", details: "Falta sitemap.xml o catalog-data.js", steps };
  }
  steps.push({ step: "Archivos validados", status: "✓" });

  // Step 4: Stage changes
  log("Preparando cambios...");
  const addResult = execute("git add .");
  if (!addResult.success) {
    error("git add falló: " + addResult.output);
    return { success: false, error: "No se pudieron preparar cambios", details: addResult.output, steps };
  }
  steps.push({ step: "Cambios preparados", status: "✓" });

  // Step 5: Commit
  log("Creando commit...");
  const commitResult = execute(`git commit -m "Actualizar catálogo de productos"`);
  if (!commitResult.success) {
    error("git commit falló: " + commitResult.output);
    return { success: false, error: "No se pudo crear commit", details: commitResult.output, steps };
  }
  steps.push({ step: "Commit creado", status: "✓" });
  log("Commit completado.");

  // Step 6: Push
  log("Publicando en GitHub...");
  const pushResult = execute("git push origin main");
  if (!pushResult.success) {
    error("git push falló: " + pushResult.output);
    return { success: false, error: "Error al publicar en GitHub", details: pushResult.output, steps };
  }
  steps.push({ step: "Cambios publicados en GitHub", status: "✓" });
  log("Push completado.");

  // Step 7: Get published URL
  log("Obteniendo información del producto...");
  const catalogResult = execute("node -e \"import fs from 'fs'; const p=JSON.parse(fs.readFileSync('data/products.json')); const last=p[p.length-1]; console.log(JSON.stringify({slug:last.slug,category:last.category,name:last.name}));\"");
  let productUrl = "https://catertracksas.co/";
  if (catalogResult.success) {
    try {
      const productInfo = JSON.parse(catalogResult.output);
      productUrl = `https://catertracksas.co/${productInfo.category}/${productInfo.slug}/`;
    } catch {}
  }

  return {
    success: true,
    message: "Producto publicado exitosamente",
    productUrl,
    changedFiles,
    steps,
  };
};

const requestHandler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
    if (body.length > 1024) {
      req.connection.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(body);
      const command = payload.command?.trim();

      if (!allowedCommands.has(command)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Comando no permitido" }));
        return;
      }

      log(`Comando recibido: ${command}`);

      let result;
      if (command === "publish") {
        result = await handlePublish();
      } else if (command === "build") {
        const buildResult = execute("npm run build");
        result = buildResult.success ? { success: true, message: "Build completado" } : { success: false, error: "Build falló", details: buildResult.output };
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (err) {
      error("Error procesando solicitud: " + err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error del servidor", details: err.message }));
    }
  });
};

const server = http.createServer(requestHandler);
server.listen(PORT, "127.0.0.1", () => {
  log(`Servicio local escuchando en http://localhost:${PORT}`);
  log("El panel puede conectarse y publicar productos automáticamente.");
});

process.on("SIGINT", () => {
  log("Servicio detenido.");
  process.exit(0);
});
