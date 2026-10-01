const AUTH_STORAGE_KEY = 'church-auth'

export function isAuthenticated() {
  try {
    const savedAuth = localStorage.getItem(
      AUTH_STORAGE_KEY
    )

    if (!savedAuth) {
      return false
    }

    const auth = JSON.parse(savedAuth)

    return auth?.isAuthenticated === true
  } catch {
    return false
  }
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getCurrentUser() {
  try {
    const savedAuth = localStorage.getItem(
      AUTH_STORAGE_KEY
    )

    if (!savedAuth) {
      return null
    }

    return JSON.parse(savedAuth)
  } catch {
    return null
  }
}