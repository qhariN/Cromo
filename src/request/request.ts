import { MatchedRoute } from "bun";

export class CromoRequest {
  constructor (
    public request: Request,
    private parsedUrl: URL,
    private matchedRoute: MatchedRoute,
    public body?: any
  ) { }

  get method (): string {
    return this.request.method
  }

  get path (): string {
    return this.parsedUrl.pathname
  }

  get headers (): any {
    return Object.fromEntries(this.request.headers)
  }

  get params (): any {
    return this.matchedRoute.params
  }

  get query (): any {
    return Object.fromEntries(this.parsedUrl.searchParams)
  }

  get blob (): any {
    return this.request.blob()
  }
}
