// netlify/functions/server.js
import { Handler } from '@netlify/functions'
import { renderPage } from 'vite-plugin-ssr/server'
import { createRequire } from 'module'

// Pour importer le manifest côté client
const require = createRequire(import.meta.url)
const clientManifest = require('../../dist/client/ssr-manifest.json')

export const handler = async (event, context) => {
  const pageContextInit = { urlOriginal: event.rawUrl }
  // En prod, on pointe directement sur dist/server
  const { httpResponse } = await renderPage(pageContextInit, {
    // root project, modes et manifests
    root: process.cwd(),
    clientManifest,
    isProduction: true
  })
  return {
    statusCode: httpResponse.statusCode,
    headers: httpResponse.headers,
    body: httpResponse.body
  }
}
