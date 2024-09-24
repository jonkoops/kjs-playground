#!/usr/bin/env node
// @ts-check
import { createServer } from 'node:http';
import httpProxy from 'http-proxy';

const PORT = 8080
const PROXIES = new Map([
  ['keycloak-server.localhost:8080', 'http://127.0.0.1:8180'],
  ['keycloak-admin.localhost:8080', 'http://127.0.0.1:8180'],
  ['kjs-playground.localhost:8080', 'http://localhost:5173'],
])

const proxyServer = httpProxy.createProxyServer({
  xfwd: true
})

const server = createServer((req, res) => {
  const host = req.headers.host
  const target = host ? PROXIES.get(host) : undefined

  if (!target) {
    throw new Error(`Unable to proxy to ${host}, no target found.`)
  }

  proxyServer.web(req, res, { target })
})

server.listen(PORT)
console.log(`listening on port ${PORT}`)
