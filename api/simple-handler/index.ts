import type { CromoHandler } from '../../src'

export const GET: CromoHandler = ({ server, request }) => {
  return Response.json(server.requestIP(request))
}
