# Keycloak JS Playground

This repo is intended as a playground that allow testing Keycloak JS for local development. Specifically it is set up to allow debugging issues related to running on a different domain (such as 3rd-party cookies).

## Setup

The project uses multiple `.localhost` domains to allow proper testing across domains. Add the following to `/etc/hosts` to ensure these domains can be reached:

```
127.0.0.1 keycloak-server.localhost keycloak-admin.localhost:8080 kjs-playground.localhost
```

This project uses PNPM its package manager, to install the correct version of PNPM automatically you must first enable [Corepack](https://nodejs.org/api/corepack.html):

```sh
corepack enable
```

Then to install all the dependencies run:

```sh
pnpm install
```

### Firefox

If you are using Firefox you'll have to set the following flags in `about:config` to ensure you can debug things properly:

- Set `security.enterprise_roots.enabled` to `true`. (allows self-signed HTTPS certificates from the system.)
- Set `privacy.antitracking.enableWebcompat` to `false`. (disables web compatibility features, to ensure to ensure full compatibility with the [State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/State_Partitioning) mechanism.)

### Chrome

When testing in Chrome it is recommended that you enable the [third-party cookies phaseout](https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2023oct#test) to get the most accurate results. 

## Development

To start developing you'll have to run several commands in separate terminal sessions. In the following order:

```sh
pnpm run server:start
```

This will download and start the latest [nightly version](https://github.com/keycloak/keycloak/releases/tag/nightly) of Keycloak. Once the server is up and running, run the following command:

```sh
pnpm run server:import-client
```

This will import the client that is used for this project, allowing us to authenticate against the Keycloak server. Once the client is imported we can run the following:

```sh
pnpm run dev
```

This starts our local [Vite](https://vitejs.dev/) development server, which allows us to serve our application and re-compile it in the background when changes are made.

```sh
pnpm run server:proxy
```

This command will start a server that proxies the requests from our domains to the local development and Keycloak server. It also generates self-signed certificates so we can test a secure HTTPS connection.

Now that everything is up and running we can visit our Keycloak server and application on the following URLs:

- Keycloak Server - https://keycloak-server.localhost:8080
- Keycloak Admin Console - https://keycloak-admin.localhost:8080
- Keycloak JS Playground - https://kjs-playground.localhost:8080

Since we are using self-signed certificates it might be the case that the browser warns you about a security issue. This can be circumvented by clicking "Advanced" and then "Accept the Risk and Continue" (or a similar equivalent in your browser).

If the Keycloak JS Playground doesn't load correctly try visiting the Keycloak server first and trust the self-signed certificate for that application first.

## Running your own Keycloak instance

If you would like to test against your own Keycloak instance for development purposes, such as fixing a bug, you can also choose to start your Keycloak server manually. To do so, run your Keycloak server with the following arguments:

```sh
start-dev --http-port=8180 --features=admin-fine-grained-authz --proxy-headers=forwarded --hostname=https://keycloak-server.localhost:8080 --hostname-admin=https://keycloak-admin.localhost:8080
```

Then when the server is running import the client confugration needed from `scripts/kjs-playground.json`.
