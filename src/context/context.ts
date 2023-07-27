import { MatchedRoute } from 'bun'

export class CromoContext {
  responseInit: ResponseInit = {}

  constructor (
    public request: Request,
    public url: URL,
    public matchedRoute: MatchedRoute,
    public body: unknown
  ) { }

  get params (): Record<string, string> {
    return this.matchedRoute.params
  }

  get query (): Record<string, string> {
    return Object.fromEntries(this.url.searchParams)
  }
}
