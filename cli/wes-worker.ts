/**
 * Most of this file is straight out of the Next.JS Custom Server section -- it runs the nextjs app
 */
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import path from 'path'
import conf from '@/app/next.config'
import { io } from 'socket.io-client'

const dir = path.join(path.dirname(__dirname), 'app')
const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 3001

console.log(`Connecting to ${process.argv[2]}...`)
fetch(`${process.argv[2]}/api/socket`).then(() => {
  const socket = io(process.argv[2]) // e.g. ws://localhost:3000
  socket.on('connect', () => {
    console.log(`Connected, joining ${process.argv[3]}...`)
    socket.emit('join', process.argv[3])
  })
  socket.on('http:send', async ({ id, path, method, body }: { id: string, path: string, method: string, body?: any }) => {
    console.log(JSON.stringify({ handle: { id, path, method, body } }))
    try {
      const req = await fetch(`http://${hostname}:${port}${path}`, { method, body: body ? body : undefined })
      const res = await req.text()
      const status = req.status
      socket.emit(`http:recv`, { id, status, body: res, headers: {} })
    } catch (err) {
      const status = 500
      console.warn(err)
      const res = JSON.stringify(err)
      socket.emit(`http:recv`, { id, status, body: res, headers: {} })
    }
  })
  socket.on('close', () => {
    console.log(`Room has closed, exiting...`)
    process.exit(0)
  })
})

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, dir, conf })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      if (!req.url) throw new Error('url is undefined')
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
}).catch((e) => console.error(e))
