<div align="center">

# 🎴 Cromo

A tiny, fast & simple file-based router server for Bun 🧅

[![NPM version][npm-version-image]][npm-url]
[![install size](https://packagephobia.com/badge?p=cromo)](https://packagephobia.com/result?p=cromo)
![NPM Downloads][npm-downloads-image]
[![npm](https://img.shields.io/npm/l/cromo.svg)](https://spdx.org/licenses/MIT)
[![CodeFactor](https://www.codefactor.io/repository/github/jhormanrus/cromo/badge/main)](https://www.codefactor.io/repository/github/jhormanrus/cromo/overview/main)
[![Build status][build-image]][build-url]

</div>

## Table of Contents

- [Set up](#server-set-up)
- [Router](#router-usage)
- [Handlers](#handlers-usage)
- [Middlewares](#middlewares)
- [Start server](#start-the-server)
- [Context object](#context-object)

### Server set up

To get started with Cromo, you need to download the package using [Bun](https://bun.sh):

```shell
bun add cromo
```

Next, import and initialize Cromo in your code:

```ts
import { Cromo } from 'cromo'

const cromo = new Cromo({
  dir: './src/api'  // default: './api'
  port: 5000        // default: Bun.env.PORT || 3000
})
```

### Router usage 
Cromo utilizes a file-based router system. By default, the router folder is named `api`, but you can change it by passing the dir option during initialization:

``` ts
// File structure example
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
import type { CromoContext, CromoHandler } from 'cromo'

// handler for GET method
export const GET: CromoHandler = (context) => {
  const { world } = context.params
  return Response.redirect(`https://google.com/search?q=${world}`)
}

// default handler is called if there is no specific handler for the method
export default (context: CromoContext): Response => {
  return Response.json(null, 404)
}
```

### Middlewares

There are three ways to add middlewares in Cromo:

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

3. Declaring `[METHOD]_middlewares` const: Declare an array of middlewares in the router files as `[METHOD]_middlewares` const to apply middlewares to a specific method.

```ts
// api/user/[name].ts
import type { CromoHandler, CromoMiddleware } from 'cromo'

export const POST: CromoHandler = ({ params, responseInit }) => {
  const { name } = params
  return Response.json({ name }, responseInit)
}

export const POST_middlewares: CromoMiddleware[] = [
  ({ responseInit }, next) => {
    responseInit.headers = {
      'Access-Control-Allow-Origin': '*'
    }
    return next(context)
  }
]
```

### Start the server

By default, Cromo will listen to port `Bun.env.PORT`, and if it is not set, it will listen to port 3000. However, you can change it by passing the `port` option during initialization.

Here is an example of starting the server:

```ts
cromo.start(port => {
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
  params: Record<string, string>
  query: Record<string, string>
  // response objects
  responseInit: ResponseInit
}
```

[npm-url]: https://www.npmjs.com/package/cromo
[npm-version-image]: https://img.shields.io/npm/v/cromo
[npm-downloads-image]: https://badgen.net/npm/dm/cromo
[build-image]: https://github.com/jhormanrus/cromo/actions/workflows/publish.yml/badge.svg
[build-url]: https://github.com/jhormanrus/cromo/actions/workflows/publish.yml
