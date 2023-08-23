export class DummyApi {
  private dir: string = './api'
  private template: string = `
    import type { CromoHandler } from '../src'

    export const GET: CromoHandler = ({ responseInit }) => {
      return Response.json(null, responseInit)
    }

    export default ({ responseInit }: CromoContext): Response => {
      return Response.json(null, responseInit)
    }
  `

  async init (dir?: string) {
    dir && (this.dir = dir)

    const proc = Bun.spawn(['mkdir', this.dir])
    await proc.exited

    Bun.write(`${this.dir}/index.ts`, this.template)
  }

  async initWithRouteMiddlewares () {
    const proc = Bun.spawn(['mkdir', this.dir])
    await proc.exited

    Bun.write(`${this.dir}/index.ts`, this.template + `
      export const middlewares: CromoMiddleware[] = [
        (context, next) => {
          context.responseInit = { status: 202 }
          return next(context)
        }
      ]
    `)
  }

  async initWithMethodMiddlewares () {
    const proc = Bun.spawn(['mkdir', this.dir])
    await proc.exited

    Bun.write(`${this.dir}/index.ts`, this.template + `
      export const GET_middlewares: CromoMiddleware[] = [
        (context, next) => {
          context.responseInit = { status: 202 }
          return next(context)
        }
      ]
    `)
  }

  async clean () {
    const proc = Bun.spawn(['rm', '-rf', this.dir])
    await proc.exited
  }
}
