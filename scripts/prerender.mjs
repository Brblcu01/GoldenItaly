import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = process.cwd()
const htmlPath = resolve(root, 'dist', 'index.html')
const serverEntry = resolve(root, 'dist-ssr', 'entry-server.js')
const template = await readFile(htmlPath, 'utf8')
const { render } = await import(pathToFileURL(serverEntry).href)
const appHtml = render()

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Prerender failed: root placeholder was not found in dist/index.html')
}

await writeFile(htmlPath, template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`), 'utf8')
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
