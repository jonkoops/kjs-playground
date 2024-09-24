# Keycloak JS Playground

This repo is intended as a playground that allow testing Keycloak JS for local development. Specifically it is set up to allow debugging issues related to running on a different domain (such as 3rd-party cookies).

## Setup

Make sure you are running the latest version of Node.js, see Node.js' [download page](https://nodejs.org/en/download/package-manager) for options. To manage dependencies [PNPM](https://pnpm.io/) is used, this is the same package manager the Keycloak project uses and allows for [easy linking](https://pnpm.io/cli/link) during development. To install the correct version of PNPM you must first enable [Corepack](https://nodejs.org/api/corepack.html):

```sh
corepack enable
```

Then to install all the dependencies run:

```sh
pnpm install
```

### Firefox

If you are using Firefox you'll want to set `privacy.antitracking.enableWebcompat` to `false` in `about:config`. This disables web compatibility features, to ensure to ensure full compatibility with the [State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/State_Partitioning) mechanism.

### Chrome

When testing in Chrome it is recommended that you enable the [third-party cookies phaseout](https://developers.google.com/privacy-sandbox/blog/cookie-countdown-2023oct#test) to get the most accurate results. 

## Development

To start developing you'll have to run several commands in separate terminal sessions. In the following order:

```sh
pnpm run server
```

This will download and start the latest [nightly version](https://github.com/keycloak/keycloak/releases/tag/nightly) of Keycloak. Once the server is up and running, run the following command:

```sh
pnpm run import-client
```

This will import the client that is used for this project, allowing us to authenticate against the Keycloak server. Once the client is imported we can run the following:

```sh
pnpm run dev
```

This starts our local [Vite](https://vitejs.dev/) development server, which allows us to serve our application and re-compile it in the background when changes are made.

```sh
pnpm run proxy
```

This command will start a server that proxies the requests from our domains to the local development and Keycloak server.

Now that everything is up and running we can visit our Keycloak server and application on the following URLs:

- Keycloak Server - http://keycloak-server.localhost:8080
- Keycloak Admin Console - http://keycloak-admin.localhost:8080
- Keycloak JS Playground - http://kjs-playground.localhost:8080

## Running your own Keycloak instance

If you would like to test against your own Keycloak instance for development purposes, such as fixing a bug, you can also choose to start your Keycloak server manually. To do so, run your Keycloak server with the following arguments:

```sh
start-dev --http-port=8180 --features=admin-fine-grained-authz --proxy-headers=forwarded --hostname=http://keycloak-server.localhost:8080 --hostname-admin=http://keycloak-admin.localhost:8080
```

Then when the server is running import the client confugration needed from `scripts/kjs-playground.json`.
