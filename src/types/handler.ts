import { MatchedRoute } from 'bun'

export type CromoHandler = (context: CromoHandlerContext) => CromoHandlerResponse

export type CromoHandlerContext = {
  request: Request,
  parsedUrl: URL,
  matchedRoute: MatchedRoute
}

export type CromoHandlerResponse = Promise<Response> | Response

export type CromoMiddleware = (context: CromoHandlerContext, next: MiddlewareHandler) => void

export type MiddlewareHandler = (context: CromoHandlerContext) => Promise<void> | void

export type Handlers = {
  [key: string]: CromoHandler | Function[]
  middlewares: CromoMiddleware[]
}
