#!/usr/bin/env node
// @ts-check
import { createServer } from 'node:https';
import httpProxy from 'http-proxy';
import mkcert from 'mkcert';

const PORT = 8080
const PROXIES = new Map([
  ['keycloak-server.local:8080', 'http://127.0.0.1:8180'],
  ['kjs-playground.local:8080', 'http://localhost:5173'],
])

const authority = await mkcert.createCA({
  organization: 'Fake Certificate Inc.',
  countryCode: 'NL',
  state: 'Noord-Holland',
  locality: 'Amsterdam',
  validity: 365
});

const certificate = await mkcert.createCert({
  domains: ['127.0.0.1', 'localhost', '*.local'],
  validity: 365,
  ca: {
    key: authority.key,
    cert: authority.cert
  }
});

const proxyServer = httpProxy.createProxyServer({
  xfwd: true
})

const server = createServer(certificate, (req, res) => {
  const host = req.headers.host
  const target = host ? PROXIES.get(host) : undefined;

  if (!target) {
    throw new Error(`Unable to proxy to ${host}, no target found.`)
  }

  proxyServer.web(req, res, { target })
})

server.listen(PORT)
console.log(`listening on port ${PORT}`)
