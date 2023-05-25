import { UserManager, Log } from "oidc-client-ts"

const infoBox = document.getElementById('info')
const loginButton = document.getElementById('login') as HTMLButtonElement
const logoutButton = document.getElementById('logout') as HTMLButtonElement
const reloginButton = document.getElementById('relogin') as HTMLButtonElement
const keycloakURL = 'https://keycloak-server.local:8080/realms/master'
const oidcSessionStoragePrefix = 'oidc.'

const userManager = new UserManager({
  authority: keycloakURL,
  client_id: 'kjs-playground',
  metadata: {
    issuer: keycloakURL,
    authorization_endpoint: keycloakURL + '/protocol/openid-connect/auth',
    token_endpoint: keycloakURL + '/protocol/openid-connect/token',
    end_session_endpoint: keycloakURL + '/protocol/openid-connect/logout',
    check_session_iframe: keycloakURL + '/protocol/openid-connect/login-status-iframe.html'
  },
  post_logout_redirect_uri: location.href,
  redirect_uri: location.href + '/redirect-callback.html',
  popup_redirect_uri: location.href + '/popup-callback.html',
  silent_redirect_uri: location.href + '/silent-callback.html',
  accessTokenExpiringNotificationTimeInSeconds: 5,
  monitorSession: true
})

const setSessionStorage = () => {
  const { authority, client_id, redirect_uri, metadata } = userManager.settings

  const message = {
    authority,
    client_id,
    redirect_uri,
    metadata: {
      issuer: metadata?.issuer,
      token_endpoint: metadata?.token_endpoint,
      check_session_iframe: metadata?.check_session_iframe
    }
  }

  sessionStorage.setItem(oidcSessionStoragePrefix + 'usermanagersettings', JSON.stringify(message));
  sessionStorage.setItem(oidcSessionStoragePrefix + 'appstarturl', location.href);
}

const handleSessionEnd = async () => {
  await userManager.removeUser()
  loginButton!.disabled = true
  logoutButton!.disabled = true
  reloginButton!.disabled = false
}

const handleAccessTokenExpired = async () => {
  console.log('handleAccessTokenExpired called')
  await handleSessionEnd()
}

const handleSilentRenewError = async () => {
  console.log('handleSilentRenewError called')
  await handleSessionEnd()
}

const handleUserSignedOut = async () => {
  console.log('handleUserSignedOut called')
  await handleSessionEnd()
}

const handleUserLoaded = () => {
  console.log('handleUserLoaded called')
  loginButton!.disabled = true
  logoutButton!.disabled = false
  reloginButton!.disabled = true
}

const handleLoginButtonClicked = async () => {
  console.log('handleLoginButtonClicked called')
  await userManager.signinRedirect()
}

const handleLogoutButtonClicked = async () => {
  console.log('handleLogoutButtonClicked called')
  await userManager.signoutRedirect()
}

const handleReloginButtonClicked = async () => {
  console.log('handleReloginButtonClicked called')
  reloginButton!.disabled = true
  try {
    await userManager.signinPopup()
  } catch (error) {
    console.warn(error)
    reloginButton!.disabled = false
  }
}

const init = async () => {
  setSessionStorage()

  Log.setLogger(console)
  Log.setLevel(Log.DEBUG)

  userManager.events.addAccessTokenExpired(handleAccessTokenExpired)
  userManager.events.addSilentRenewError(handleSilentRenewError)
  userManager.events.addUserSignedOut(handleUserSignedOut)
  userManager.events.addUserLoaded(handleUserLoaded)

  loginButton?.addEventListener('click', handleLoginButtonClicked)
  logoutButton?.addEventListener('click', handleLogoutButtonClicked)
  reloginButton?.addEventListener('click', handleReloginButtonClicked)

  let user = await userManager.getUser()

  if (user == null || user.expired) {
    user = await userManager.signinSilent()
  }
  handleUserLoaded()
  infoBox!.innerText = 'Logged in as ' + user?.profile.preferred_username
}

console.log(userManager)
await init()