import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}
const host = valueAfter('--host', '127.0.0.1')
const port = Number(valueAfter('--port', '5200'))
const root = path.resolve('dist')
const mimeTypes = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.mp4': 'video/mp4', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8',
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', `http://${host}:${port}`).pathname)
    const relative = pathname === '/' ? 'index.html' : pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1)
    const filePath = path.resolve(root, relative)
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) throw new Error('Invalid path')
    const details = await stat(filePath)
    if (!details.isFile()) throw new Error('Not a file')
    const body = await readFile(filePath)
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' })
    response.end(body)
  } catch {
    const notFound = await readFile(path.join(root, '404.html'))
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(notFound)
  }
})

server.listen(port, host, () => console.log(`Golden Italy preview: http://${host}:${port}/`))
