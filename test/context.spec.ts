import { describe, expect, it } from 'bun:test'
import { CromoContext } from '../src/context/context'

describe('Context', () => {
  it('initialize', async () => {
    const param = '0001'
    const query = '0002'
    const body = { message: '0003' }
    const request = new Request(`http://localhost:3000?query=${query}`, {
      body: JSON.stringify({ body })
    })

    const router = new Bun.FileSystemRouter({
      style: 'nextjs',
      dir: './api',
      fileExtensions: ['.ts']
    })
    const matchedRoute = router.match(`/${param}`)!

    const server = Bun.serve({ fetch: () => new Response() })
    server.stop()

    const context = new CromoContext(request, matchedRoute, server)

    expect(context.params).toEqual({ param })
    expect(context.query).toEqual({ query })
    expect(await context.body).toEqual({ body })
  })
})
