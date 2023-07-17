import { CromoRequest } from '../request/request'
import { CromoResponse } from '../response/response'
import type { CromoHandler, CromoHandlerResponse, CromoMiddleware } from '../types/handler'

export class Use {
  constructor (private middlewares: CromoMiddleware[] = []) { }

  exec (fn: CromoHandler, request: CromoRequest, response: CromoResponse): CromoHandlerResponse {
    const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]: CromoMiddleware[]): CromoHandler => {
      if (firstMiddleware) {
        return (request, response) => {
          return firstMiddleware(request, response, chainMiddlewares(restOfMiddlewares))
        }
      }
      return fn
    }
    chainMiddlewares(this.middlewares)(request, response)
  }
}
