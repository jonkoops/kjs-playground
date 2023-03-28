# Keycloak JS Playground

This repo is intended as a playground that allow testing Keycloak JS for local development.

## Setup

The project uses multiple `.local` domains to allow testing 3rd party cookies properly. Add the following to `/etc/hosts` to ensure these domains can be reached:

```
127.0.0.1 keycloak-server.local kjs-playground.local
```

### Firefox

If you are using Firefox you'll have to set the following flags in `about:config` to ensure you can debug things properly:

- Set `security.enterprise_roots.enabled` to `true`. (allows self-signed HTTPS certificates from the system.)
- Set `privacy.antitracking.enableWebcompat` to `false`. (disables web compatibility features, to ensure to ensure full compatibility with the [State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/State_Partitioning) mechanism.)

## Development

To start developing you'll have to run several commands in separate terminal sessions. In the following order:

```sh
npm run server:start
```

This will download and start the latest [nightly version](https://github.com/keycloak/keycloak/releases/tag/nightly) of Keycloak. Once the server is up and running, run the following command:

```sh
npm run server:import-client
```

This will import the client that is used for this project, allowing us to authenticate against the Keycloak server. Once the client is imported we can run the following:

```sh
npm run dev
```

This starts our local [Vite](https://vitejs.dev/) development server, which allows us to serve our application and re-compile it in the background when changes are made.

```sh
npm run server:proxy
```

This command will start a server that proxies the requests from our domains to the local development and Keycloak server. It also generates self-signed certificates so we can test a secure HTTPS connection.

Now that everything is up and running we can visit our Keycloak server and application on the following URLs:

- Keycloak Server - https://keycloak-server.local:8080
- Keycloak JS Playground - https://kjs-playground.local:8080

Since we are using self-signed certificates it might be the case that the browser warns you about a security issue. This can be circumvented by clicking "Advanced" and then "Accept the Risk and Continue" (or a similar equivalent in your browser).

If the Keycloak JS Playground doesn't load correctly try visiting the Keycloak server first and trust the self-signed certificate for that application first.
