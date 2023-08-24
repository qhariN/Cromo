import type { CromoContext } from '../src'

export default (context: CromoContext): Response => {
  return Response.json(null, context.responseInit)
}
