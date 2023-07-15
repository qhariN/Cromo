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
        const { pathname } = new URL(url)

        const matchedRoute = router.match(pathname)
        if (!matchedRoute) return response

        const handler = await import(matchedRoute.filePath)
        if (!handler[method]) return response

        return handler[method]()
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}