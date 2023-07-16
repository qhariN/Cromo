import { MatchedRoute } from 'bun'

export type CromoHandler = (
  context: {
    request: Request,
    parsedUrl: URL,
    matchedRoute: MatchedRoute
  }
) => Promise<Response> | Response