import { CromoContext } from './context/context'
import type { Handlers } from './types/handler'
import { Use } from './use/use'

export class Cromo {
  private router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './api',
    fileExtensions: ['.ts', '.js']
  })

  listen (callback: (port: number) => undefined) {
    const router = this.router

    Bun.serve({
      async fetch (request) {
        const notFound = new Response(null, { status: 404 })

        const { url, method } = request
        const parsedUrl = new URL(url)

        const matchedRoute = router.match(parsedUrl.pathname)
        if (!matchedRoute) return notFound

        const handlers: Handlers = await import(matchedRoute.filePath)
        const handler = handlers[method] || handlers.default
        if (!handler || typeof handler !== 'function') return notFound

        const use = new Use(handlers.use)
        const body = request.body ? await request.json() : void 0

        const context = new CromoContext(request, parsedUrl, matchedRoute, body)
        return use.exec(handler, context) || notFound
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}
