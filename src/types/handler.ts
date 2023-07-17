import { CromoResponse } from '../response/response'
import { CromoRequest } from '../request/request'

export type CromoHandler = (request: CromoRequest, response: CromoResponse) => CromoHandlerResponse

export type CromoHandlerResponse = Promise<void> | void

export type CromoMiddleware = (request: CromoRequest, response: CromoResponse, next: CromoHandler) => undefined

export type Handlers = {
  [key: string]: CromoHandler | Function[]
  use: CromoMiddleware[]
}
