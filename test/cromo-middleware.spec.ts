import { Cromo } from '../src'
import { afterEach, describe, expect, it } from 'bun:test'
import { DummyApi } from './test-utils'

describe('Cromo middleware', () => {
  let cromo: Cromo
  const dummyApi = new DummyApi()

  it('use global middleware', async () => {
    await dummyApi.init()

    cromo = new Cromo()
    cromo.setMiddleware([
      (context, next) => {
        context.responseInit.status = 202
        return next(context)
      }
    ])
    cromo.start()

    const request = fetch('http://localhost:3000')
    const httpStatus = (await request).status

    expect(httpStatus).toBe(202)
  })

  afterEach(() => {
    cromo.stop()
    dummyApi.clean()
  })
})
