export class DummyApi {
  private dir: string = './api'

  async init (dir?: string) {
    dir && (this.dir = dir)

    const proc = Bun.spawn(['mkdir', this.dir])
    await proc.exited

    Bun.write(`${this.dir}/index.ts`, `
      import type { CromoHandler } from 'cromo'
      export const GET: CromoHandler = () => Response.json({ message: 'Hello World!' })
    `)
  }

  async clean () {
    const proc = Bun.spawn(['rm', '-rf', this.dir])
    await proc.exited
  }
}
