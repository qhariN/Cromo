<div align="center">

# 🎴 Cromo

A tiny, fast & simple file-based router server for Bun 🧅

[![NPM Version][npm-version-image]][npm-url]
[![CodeFactor](https://www.codefactor.io/repository/github/lau1944/bunrest/badge/main)](https://www.codefactor.io/repository/github/jhormanrus/cromo/overview/main)
![NPM Downloads][npm-downloads-image]

</div>

## Table of Contents

- [Set up](#server-set-up)
- [Router](#router-usage)
- [Handlers](#handlers-usage)
- [Middlewares](#middlewares)
- [Start server](#start-the-server-listen-to-port)
- [Context object](#context-object)

### Server set up

To get started, download the package:

```shell
bun add cromo
```

Then, import and initialize Cromo in your code:

```ts
import { Cromo } from 'cromo'

const cromo = new Cromo()
```

### Router usage 

As we are using file-based router, we need to create a folder called `api` at the root of the project, similar to the SvelteKit router:

```
├── api
│   ├── hello
│   │   ├── [world]
│   │   │   └── index.ts
│   └── user
│       ├── [name].ts
│       └── index.ts
└── index.ts
```

### Handlers usage

Inside the router files, you can write HTTP method handlers:

```ts
// api/hello/[world]/index.ts
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = (context) => {
  const { world } = context.params
  return Response.redirect(`https://google.com/search?q=${world}`)
}
```

### Middlewares

There are two ways to add middlewares:

1. Using `setMiddleware`: Simply call `setMiddleware` to add an array of middlewares to the server.

```ts
// index.ts
cromo.setMiddleware([
  (context, next) => {
    console.log("middlewares called")
    return next(context)
  },
  ...
])
```

2. Declaring `middlewares` const: Declare an array of middlewares in the router files as `middlewares` const.

```ts
// api/user/index.ts
import type { CromoHandler, CromoMiddleware } from 'cromo'

export const GET: CromoHandler = ({ responseInit }) => {
  return Response.json({ name: 'John' }, responseInit)
}

export const middlewares: CromoMiddleware[] = [
  ({ responseInit }, next) => {
    responseInit.headers = {
      'Access-Control-Allow-Origin': '*'
    }
    return next(context)
  }
]
```

### Start the server, listen to port

By default, Cromo will listen to port `Bun.env.PORT`, if it is not set, it will listen to port 3000.

```ts
cromo.listen(port => {
  console.log(`Listening on port ${port}`)
})
```

### Context object

In Cromo, we use the context object to pass data between middlewares and handlers. It contains basic Web API objects like `Request`, `URL`, `ResponseInit`, and some useful properties like `matchedRoute`, `body`, `params`, `query`.

```ts
import { MatchedRoute } from 'bun'

export interface CromoContext {
  // request objects
  request: Request
  url: URL
  matchedRoute: MatchedRoute
  body: unknown
  params: any
  query: any
  // response objects
  responseInit: ResponseInit
}
```

[npm-url]: https://www.npmjs.com/package/cromo
[npm-version-image]: https://badgen.net/npm/v/bunrest
[npm-downloads-image]: https://badgen.net/npm/dm/cromo