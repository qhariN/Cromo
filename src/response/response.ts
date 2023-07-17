export class CromoResponse {
  private response?: Response
  private options: ResponseInit = {}

  status (code: number): CromoResponse {
    this.options.status = code
    return this
  }

  option (option: ResponseInit): CromoResponse {
    this.options = { ...this.options, ...option }
    return this
  }

  statusText (text: string): CromoResponse {
    this.options.statusText = text
    return this
  }

  json (body: any): undefined {
    this.response = Response.json(body, this.options)
  }

  send (body: any): undefined {
    this.response = new Response(body, this.options)
  }

  setHeader (key: string, value: any) {
    if (!key || !value) {
      throw new Error('Headers key or value should not be empty')
    }

    const headers = this.options.headers
    this.options.headers = { ...headers, [key]: value }
    return this
  }

  getHeader () {
    return this.options.headers
  }

  headers (header: HeadersInit): CromoResponse {
    this.options.headers = header
    return this
  }

  getResponse (): Response | undefined {
    return this.response
  }

  isReady (): boolean {
    return !!this.response
  }
}
