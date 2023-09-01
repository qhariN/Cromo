import { CromoContext } from './context/context'
import type { CromoMiddleware, Handlers, Method } from './types/handler'
import { Runner } from './runner/runner'
import type { FileSystemRouter, Server } from 'bun'

export class Cromo {
  private middlewares: CromoMiddleware[] = []
  private router: FileSystemRouter
  private server: Server | undefined

  constructor (public options?: { dir?: string, port?: number }) {
    this.router = new Bun.FileSystemRouter({
      style: 'nextjs',
      dir: options?.dir || './api',
      fileExtensions: ['.ts', '.js']
    })
  }

  setMiddleware (middlewares: CromoMiddleware[]) {
    this.middlewares = middlewares
  }

  start (callback?: (port: number) => undefined) {
    const router = this.router
    const middlewares = this.middlewares

    this.server = Bun.serve({
      port: this.options?.port,
      async fetch (request) {
        const notFound = new Response(null, { status: 404 })

        const method = request.method.toUpperCase() as Method
        const pathname = new URL(request.url).pathname

        const matchedRoute = router.match(pathname)
        if (!matchedRoute) return notFound

        const handlers: Handlers = await import(matchedRoute.filePath)
        const handler = handlers[method] || handlers.default
        if (!handler || typeof handler !== 'function') return notFound

        if (handlers.middlewares)
          middlewares.push(...handlers.middlewares)
        if (handlers[`${method}_middlewares`])
          middlewares.push(...handlers[`${method}_middlewares`])

        const runner = new Runner(middlewares)
        const context = new CromoContext(request, matchedRoute)
        return runner.exec(handler, context) || notFound
      }
    })

    callback && callback(this.server.port)
  }

  stop (closeActiveConnections?: boolean) {
    this.server?.stop(closeActiveConnections)
  }
}
