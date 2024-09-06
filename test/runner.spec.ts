import { describe, expect, it } from 'bun:test'
import { Runner } from '../src/runner/runner'
import type { CromoHandler } from '../src'
import { CromoContext } from '../src/context/context'

describe('Runner', () => {
  const request = new Request(`http://localhost:3000`)
  const router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './api',
    fileExtensions: ['.ts']
  })
  const matchedRoute = router.match('/')!
  const server = Bun.serve({ fetch: () => new Response() })
  server.stop()

  const context = new CromoContext(request, matchedRoute, server)

  const handler: CromoHandler = (context) => Response.json(null, context.responseInit)

  it('executes 1 middleware', () => {
    const runner = new Runner([
      (context, next) => {
        context.responseInit = { status: 202 }
        return next(context)
      }
    ])

    const response = runner.exec(handler, context) as Response

    expect(response.status).toBe(202)
  })

  it('executes n middlewares', () => {
    const runner = new Runner([
      (context, next) => {
        context.responseInit = { status: 202 }
        return next(context)
      },
      (context, next) => {
        context.responseInit = { ...context.responseInit, headers: { 'x-custom-header': 'custom' } }
        return next(context)
      }
    ])

    const response = runner.exec(handler, context) as Response

    expect(response.status).toBe(202)
    expect(response.headers.get('x-custom-header')).toBe('custom')
  })
})
