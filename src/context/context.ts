import { MatchedRoute } from 'bun'

export class CromoContext {
  responseInit: ResponseInit = {}

  constructor (
    public request: Request,
    public url: URL,
    public matchedRoute: MatchedRoute,
    public body: unknown
  ) { }

  get params (): any {
    return this.matchedRoute.params
  }

  get query (): any {
    return Object.fromEntries(this.url.searchParams)
  }
}
