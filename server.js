import express from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')
const port = process.env.PORT || 3000

const app = express()

app.use(express.static(distDir))

// SPA fallback: serve index.html for any unmatched route
app.use((_req, res) => {
  res.sendFile(join(distDir, 'index.html'))
})

app.listen(port, () => {
  console.log(`MIRRAI server running on port ${port}`)
})
