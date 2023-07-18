import type { CromoContext } from '../context/context'

export type CromoHandler = (context: CromoContext) => CromoResponse

export type CromoResponse = Promise<Response> | Response

export type CromoMiddleware = (context: CromoContext, next: CromoHandler) => CromoResponse

export type Handlers = {
  [key: string]: CromoHandler | Function[]
  use: CromoMiddleware[]
}
