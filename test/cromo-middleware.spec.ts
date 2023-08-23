import { Cromo } from '../src'
import { afterEach, describe, expect, it } from 'bun:test'
import { DummyApi } from './test-utils'

describe('Cromo middleware', () => {
  let cromo: Cromo
  const dummyApi = new DummyApi()
  const status = 202

  it('use global middleware', async () => {
    await dummyApi.init()

    cromo = new Cromo()
    cromo.setMiddleware([
      (context, next) => {
        context.responseInit = { status }
        return next(context)
      }
    ])
    cromo.start()

    const request = fetch('http://localhost:3000')
    const httpStatus = (await request).status

    expect(httpStatus).toBe(status)
  })

  it('use route middleware', async () => {
    await dummyApi.initWithRouteMiddlewares()

    cromo = new Cromo()
    cromo.start()

    const request = fetch('http://localhost:3000', { method: 'PUT' })
    const httpStatus = (await request).status

    expect(httpStatus).toBe(status)
  })

  describe('use method middleware', () => {
    it('handle only specified method', async () => {
      await dummyApi.initWithMethodMiddlewares()
  
      cromo = new Cromo()
      cromo.start()
  
      const request = fetch('http://localhost:3000')
      const httpStatus = (await request).status
  
      expect(httpStatus).toBe(status)
    })

    it('does not handle other methods', async () => {
      await dummyApi.initWithMethodMiddlewares()
  
      cromo = new Cromo()
      cromo.start()
  
      const request = fetch('http://localhost:3000', { method: 'POST' })
      const httpStatus = (await request).status
  
      expect(httpStatus).toBe(200)
    })
  })

  afterEach(() => {
    cromo.stop()
    dummyApi.clean()
  })
})
