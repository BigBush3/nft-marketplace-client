const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 8080
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })
  server.get('/product/:productId', (req, res) => {
    return app.render(req, res, '/product/productId', { // `pages/dashboard/item/id.js` is the name of the page in my directory
      ...req.params,
      ...req.query,
    });
  });
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})