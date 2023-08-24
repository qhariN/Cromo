import type { CromoContext, CromoMiddleware } from '../src'

export default (context: CromoContext): Response => {
  return Response.json(null, context.responseInit)
}

export const middlewares: CromoMiddleware[] = [
  (context, next) => {
    context.responseInit = { status: 202 }
    return next(context)
  }
]
