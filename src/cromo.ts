import { CromoHandler } from "./types/handler"

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

        const handlers: Record<string, CromoHandler> = await import(matchedRoute.filePath)
        const handler = handlers[method] || handlers.default
        if (!handler) return response

        return handler({ request, parsedUrl, matchedRoute })
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}