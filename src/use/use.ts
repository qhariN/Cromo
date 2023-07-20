import type { CromoContext } from '../context/context'
import type { CromoHandler, CromoResponse, CromoMiddleware } from '../types/handler'

export class Use {
  constructor (
    private middlewares: CromoMiddleware[]
  ) { }

  exec (fn: CromoHandler, context: CromoContext): CromoResponse {
    const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]: CromoMiddleware[]): CromoHandler => {
      if (firstMiddleware) {
        return (context) => {
          return firstMiddleware(context, chainMiddlewares(restOfMiddlewares))
        }
      }
      return fn
    }
    return chainMiddlewares(this.middlewares)(context)
  }
}
