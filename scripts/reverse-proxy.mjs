#!/usr/bin/env node
// @ts-check
import { createServer } from 'node:http';
import httpProxy from 'http-proxy';

const PORT = 8080
const PROXIES = new Map([
  ['auth.keycloak.localhost:8080', 'http://127.0.0.1:8180'],
  ['admin.keycloak.localhost:8080', 'http://127.0.0.1:8180'],
  ['playground.localhost:8080', 'http://localhost:5173'],
])

const proxyServer = httpProxy.createProxyServer({
  xfwd: true
})

const server = createServer((req, res) => {
  proxyServer.web(req, res, { target: getProxyTarget(req) })
})

server.on('upgrade', (req, socket, head) => {
  proxyServer.ws(req, socket, head, { target: getProxyTarget(req) })
});

server.listen(PORT)
console.log(`listening on port ${PORT}`)

/**
 * @param {import('node:http').IncomingMessage} req 
 */
function getProxyTarget(req) {
  const host = req.headers.host
  const target = host ? PROXIES.get(host) : undefined

  if (!target) {
    throw new Error(`Unable to proxy to ${host}, no target found.`)
  }

  return target;
}
