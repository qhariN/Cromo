import type { CromoHandler, CromoHandlerContext, Handlers } from "./types/handler"
import { Use } from "./use/use"

export class Cromo {
  router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './api',
    fileExtensions: ['.ts', '.js']
  })
  
  listen (callback: (port: number) => void) {
    const router = this.router

    Bun.serve({
      async fetch (request) {
        const response = new Response(null, { status: 404 })
        
        const { url, method } = request
        const parsedUrl = new URL(url)

        const matchedRoute = router.match(parsedUrl.pathname)
        if (!matchedRoute) return response

        const handlers: Handlers = await import(matchedRoute.filePath)
        const handler = (handlers[method] || handlers.default) as CromoHandler
        if (!handler) return response

        const context: CromoHandlerContext = { request, parsedUrl, matchedRoute }
        if (handlers.middlewares) {
          const use = new Use(handlers.middlewares)
          return use.exec(handler, context)
        }

        return handler(context)
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}