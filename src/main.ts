import {UserManager} from "oidc-client-ts"

const userManager = new UserManager({
  authority: 'https://keycloak-server.local:8080/realms/master',
  client_id: 'kjs-playground',
  redirect_uri: location.href
});