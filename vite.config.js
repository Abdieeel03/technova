import { MongoClient } from 'mongodb'
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

function productosApiDevPlugin(env) {
  const uri = env.MONGODB_URI
  const dbName = env.MONGODB_DB_NAME || 'technova-products'
  let clientPromise

  const getCollection = async () => {
    if (!uri) {
      throw new Error('Missing MONGODB_URI environment variable')
    }

    if (!clientPromise) {
      clientPromise = new MongoClient(uri).connect()
    }

    const client = await clientPromise
    return client.db(dbName).collection('productos')
  }

  const sendJson = (res, statusCode, body) => {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }

  const parseBoolean = (value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return undefined
  }

  return {
    name: 'technova-productos-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')

        if (!url.pathname.startsWith('/api/productos')) {
          next()
          return
        }

        if (req.method !== 'GET') {
          res.setHeader('Allow', 'GET')
          sendJson(res, 405, { error: 'Method not allowed' })
          return
        }

        try {
          const collection = await getCollection()
          const detailMatch = url.pathname.match(/^\/api\/productos\/(\d+)$/)

          if (detailMatch) {
            const producto = await collection.findOne(
              { id: Number(detailMatch[1]) },
              { projection: { _id: 0 } },
            )

            sendJson(
              res,
              producto ? 200 : 404,
              producto ? { producto } : { error: 'Product not found' },
            )
            return
          }

          if (url.pathname !== '/api/productos') {
            sendJson(res, 404, { error: 'Endpoint not found' })
            return
          }

          const query = {}
          const categoria = url.searchParams.get('categoria')
          const tipo = url.searchParams.get('tipo')
          const masVendido = parseBoolean(url.searchParams.get('masVendido'))
          const limit = Number(url.searchParams.get('limit'))

          if (categoria) query.categoria = categoria
          if (tipo) query.tipo = tipo
          if (typeof masVendido === 'boolean') query.masVendido = masVendido

          const cursor = collection
            .find(query, { projection: { _id: 0 } })
            .sort({ id: 1 })

          if (Number.isInteger(limit) && limit > 0) {
            cursor.limit(limit)
          }

          const productos = await cursor.toArray()
          sendJson(res, 200, { productos })
        } catch (error) {
          console.error('Error fetching productos in Vite dev server', error)
          sendJson(res, 500, { error: 'Error fetching productos' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      productosApiDevPlugin(env),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  }
})
