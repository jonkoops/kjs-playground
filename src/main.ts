import Keycloak from "keycloak-js"

const keycloak = new Keycloak({
  url: 'https://keycloak-server.local:8080',
  realm: 'master',
  clientId: 'kjs-playground'
})

const loginButton = document.getElementById('login')!
const logoutButton = document.getElementById('logout')!
const updateTokenButton = document.getElementById('updateToken')!
const infoText = document.getElementById('info')!

loginButton.addEventListener('click', () => keycloak.login())
logoutButton.addEventListener('click', () => keycloak.logout({ redirectUri: window.location.origin }))
updateTokenButton.addEventListener('click', () => keycloak.updateToken(9999))

function updateScreen() {
  if (keycloak.authenticated) {
    infoText.textContent = "User is authenticated."
  } else {
    infoText.textContent = "User is not authenticated."
  }
}

const handleEvent = (eventName: string) => (...params: unknown[]) => {
  console.log(eventName, ...params)
  updateScreen()
}

keycloak.onReady = handleEvent('Ready')
keycloak.onAuthSuccess = handleEvent('AuthSuccess')
keycloak.onAuthError = handleEvent('AuthError')
keycloak.onAuthRefreshSuccess = handleEvent('AuthRefreshSuccess')
keycloak.onAuthRefreshError = handleEvent('AuthRefreshError')
keycloak.onAuthLogout = handleEvent('AuthLogout')
keycloak.onTokenExpired = handleEvent('TokenExpired')

try {
  await keycloak.init({
    onLoad: 'check-sso',
    // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  })
} catch (error) {
  console.error('Unable to initialize Keycloak:', error)
}
