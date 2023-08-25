import type { CromoContext } from '../src'

export default (context: CromoContext): Response => {
  const { params } = context
  return Response.json(params, context.responseInit)
}
