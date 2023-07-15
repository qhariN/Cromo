console.log("Hello via Bun!");

const apiDir = './api'

const router = new Bun.FileSystemRouter({
  style: 'nextjs',
  dir: apiDir,
  fileExtensions: ['.ts', '.js']
})

console.log(
  router.match('/hello/world')
)

const matchedRoute = router.match('/')!

const module = await import(`${apiDir}/${matchedRoute.src}`)

console.log(module['GET']())