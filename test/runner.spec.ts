import { describe, expect, it } from 'bun:test'
import { Runner } from '../src/runner/runner'
import { CromoHandler } from '../src'
import { CromoContext } from '../src/context/context'

describe('Runner', () => {
  it('initialize', () => {
    const runner = new Runner([])

    expect(runner).toBeInstanceOf(Runner)
  })

  it('execute middleware', () => {
    const handler: CromoHandler = (context) => Response.json(null, context.responseInit)
    const runner = new Runner([
      (context, next) => {
        context.responseInit = { status: 202 }
        return next(context)
      }
    ])

    const request = new Request(`http://localhost:3000`)
    const router = new Bun.FileSystemRouter({
      style: 'nextjs',
      dir: './api',
      fileExtensions: ['.ts']
    })
    const matchedRoute = router.match('/')!
    const context = new CromoContext(request, matchedRoute)
    const response = runner.exec(handler, context) as Response

    expect(response.status).toBe(202)
  })
})
