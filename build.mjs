// Two bundles: the page (src/page.ts: KaTeX and its fonts in one HTML document, for the app's web view) and main.js
// (src/main.ts, run by the app's plugin host), which carries the page as a string.
import * as esbuild from "esbuild"
import { readFileSync } from "node:fs"

// KaTeX's CSS offers each font as woff2, woff and ttf; every web view the app uses takes woff2, so only those go in.
const woff2Only = {
  name: "woff2-only",
  setup(build) {
    build.onLoad({ filter: /katex[\\/]dist[\\/]katex\.min\.css$/ }, (args) => ({
      loader: "css",
      contents: readFileSync(args.path, "utf8").replace(/,url\([^)]+\.woff\) format\("woff"\),url\([^)]+\.ttf\) format\("truetype"\)/g, ""),
    }))
  },
}

const page = await esbuild.build({
  entryPoints: ["src/page.ts"],
  bundle: true,
  format: "iife",
  minify: true,
  write: false,
  outdir: "page",
  target: "safari18",
  loader: { ".woff2": "dataurl" },
  plugins: [woff2Only],
  logLevel: "warning",
})
const output = (ext) => page.outputFiles.find((f) => f.path.endsWith(ext))?.text ?? ""
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${output(".css")}</style></head><body><div id="root"></div><script>${output(".js")}</script></body></html>`

await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  globalName: "__plugin",
  target: "es2022",
  outfile: "main.js",
  define: { PAGE: JSON.stringify(html) },
  logLevel: "warning",
})
console.log(`main.js: page ${(html.length / 1e3).toFixed(0)} kB`)
