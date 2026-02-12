import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function safePath(requestPath) {
  const normalized = path.normalize(requestPath).replace(/^\/+/, "");
  if (normalized.includes("..")) {
    return null;
  }
  return normalized;
}

function resolveFile(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  const cleaned = safePath(url.pathname === "/" ? "static/storybook/index.html" : url.pathname);

  if (!cleaned) {
    return null;
  }

  const absolute = path.join(ROOT, cleaned);
  if (!absolute.startsWith(ROOT)) {
    return null;
  }

  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
    return absolute;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url || "/");
  if (!filePath) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, { "content-type": mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`No-Django preview server running at http://localhost:${PORT}`);
});
