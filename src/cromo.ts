import { CromoRequest } from "./request/request"
import { CromoResponse } from "./response/response"
import type { Handlers } from "./types/handler"
import { Use } from "./use/use"

export class Cromo {
  private router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './api',
    fileExtensions: ['.ts', '.js']
  })

  listen (callback: (port: number) => undefined) {
    const router = this.router

    Bun.serve({
      async fetch (originalRequest) {
        const notFound = new Response(null, { status: 404 })

        const { url, method } = originalRequest
        const parsedUrl = new URL(url)

        const matchedRoute = router.match(parsedUrl.pathname)
        if (!matchedRoute) return notFound

        const handlers: Handlers = await import(matchedRoute.filePath)
        const handler = handlers[method] || handlers.default
        if (!handler || typeof handler !== 'function') return notFound

        const use = new Use(handlers.use)
        const body = originalRequest.body ? await originalRequest.json() : void 0
        const request = new CromoRequest(originalRequest, parsedUrl, matchedRoute, body)
        const response = new CromoResponse()
        use.exec(handler, request, response)

        return response.getResponse() || notFound
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}
