import { Cromo } from '../src'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

describe('Middleware', () => {
  let cromo: Cromo
  const url = 'http://localhost:3000'
  const status = 202

  it('use global middleware', async () => {
    cromo = new Cromo()
    cromo.setMiddleware([
      (context, next) => {
        context.responseInit = { status }
        return next(context)
      }
    ])
    cromo.start()

    const request = fetch(url)
    const httpStatus = (await request).status

    expect(httpStatus).toBe(status)
  })

  it('use route middleware', async () => {
    cromo = new Cromo()
    cromo.start()

    const request = fetch(`${url}/route-middleware`, { method: 'PUT' })
    const httpStatus = (await request).status

    expect(httpStatus).toBe(status)
  })

  describe('use method middleware', () => {
    beforeEach(() => {
      cromo = new Cromo()
      cromo.start()
    })

    it('handle only specified method', async () => {
      const request = fetch(`${url}/method-middleware`)
      const httpStatus = (await request).status
  
      expect(httpStatus).toBe(status)
    })

    it('does not handle other methods', async () => {
      const request = fetch(`${url}/method-middleware`, { method: 'POST' })
      const httpStatus = (await request).status
  
      expect(httpStatus).toBe(200)
    })
  })

  afterEach(() => {
    cromo.stop(true)
  })
})
