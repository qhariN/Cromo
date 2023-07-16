import type { CromoHandler, CromoHandlerContext, CromoHandlerResponse, CromoMiddleware, MiddlewareHandler } from '../types/handler'

export class Use {
  constructor (public middlewareStack: CromoMiddleware[] = []) { }

  exec (fn: CromoHandler, context: CromoHandlerContext): CromoHandlerResponse {
    const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]: CromoMiddleware[]): MiddlewareHandler | CromoHandler => {
      if (firstMiddleware) {
        return (context: CromoHandlerContext) => {
          return firstMiddleware(context, chainMiddlewares(restOfMiddlewares) as MiddlewareHandler)
        }
      }
      return fn
    }
    return (chainMiddlewares(this.middlewareStack) as CromoHandler)(context)
  }
}