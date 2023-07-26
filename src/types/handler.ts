import type { CromoContext } from '../context/context'

export type CromoHandler = (context: CromoContext) => CromoResponse

export type CromoResponse = Promise<Response> | Response

export type CromoMiddleware = (context: CromoContext, next: CromoHandler) => CromoResponse

export type Handlers = {
  default?: CromoHandler
  GET?: CromoHandler
  POST?: CromoHandler
  PUT?: CromoHandler
  PATCH?: CromoHandler
  DELETE?: CromoHandler
  OPTIONS?: CromoHandler
  middlewares: CromoMiddleware[]
  GET_middlewares: CromoMiddleware[]
  POST_middlewares: CromoMiddleware[]
  PUT_middlewares: CromoMiddleware[]
  PATCH_middlewares: CromoMiddleware[]
  DELETE_middlewares: CromoMiddleware[]
  OPTIONS_middlewares: CromoMiddleware[]
  [key: string]: any
}
