import { useState } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Church,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  getDocs,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { db, auth } from '../firebase'

const AUTH_STORAGE_KEY = 'church-auth'
const USERS_COLLECTION = 'users'

const USERNAME_EMAILS = {
  admin: 'eaiancymi@gmail.com',
}

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] = useState('')

  const [loading, setLoading] =
    useState(false)

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    const username =
      formData.username.trim()

    const password =
      formData.password

    if (!username || !password) {
      setError(
        'Please enter your username and password.'
      )
      return
    }

    setLoading(true)

    try {
      /*
       * Convert the application username
       * into the Firebase Authentication email.
       */
      const email =
        USERNAME_EMAILS[
          username.toLowerCase()
        ]

      if (!email) {
        setError(
          'Invalid username or password. Please check your credentials.'
        )

        setLoading(false)

        return
      }

      /*
       * Authenticate with Firebase Authentication.
       *
       * Firebase handles the actual password
       * verification.
       */
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

      const firebaseUser =
        credential.user

      /*
       * Load the application profile
       * from Firestore.
       */
      const usersSnapshot =
        await getDocs(
          collection(
            db,
            USERS_COLLECTION
          )
        )

      const users =
        usersSnapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        )

      /*
       * Find the Firestore profile using
       * the Firebase Authentication UID.
       */
      let user =
        users.find(
          (item) =>
            item.uid ===
            firebaseUser.uid
        )

      /*
       * Fallback to email matching if the
       * Firestore UID has not been added yet.
       */
      if (!user) {
        user =
          users.find(
            (item) =>
              String(
                item.email || ''
              )
                .trim()
                .toLowerCase() ===
              firebaseUser.email
                ?.trim()
                .toLowerCase()
          )
      }

      /*
       * Authentication succeeded, but there
       * is no matching church profile.
       */
      if (!user) {
        setError(
          'Your login is valid, but your church account profile has not been configured yet. Please contact an administrator.'
        )

        setLoading(false)

        return
      }

      /*
       * Check account status.
       */
      if (
        user.status &&
        String(user.status)
          .toLowerCase() !==
          'active'
      ) {
        setError(
          'This account is inactive. Please contact an administrator.'
        )

        setLoading(false)

        return
      }

      /*
       * Save the authenticated application
       * session locally.
       */
      const authData = {
        isAuthenticated: true,

        userId:
          user.id,

        uid:
          firebaseUser.uid,

        username:
          user.username ||
          username,

        name:
          user.name ||
          user.fullName ||
          username,

        role:
          user.role ||
          'Administrator',

        status:
          user.status ||
          'Active',

        email:
          firebaseUser.email ||
          user.email ||
          '',

        loginTime:
          new Date().toISOString(),
      }

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(authData)
      )

      /*
       * Send the authenticated user
       * directly to the dashboard.
       */
      navigate('/', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Firebase login failed:',
        error
      )

      if (
        error.code ===
          'auth/invalid-credential' ||
        error.code ===
          'auth/wrong-password' ||
        error.code ===
          'auth/user-not-found'
      ) {
        setError(
          'Invalid username or password. Please check your credentials.'
        )
      } else if (
        error.code ===
        'auth/too-many-requests'
      ) {
        setError(
          'Too many login attempts. Please wait a moment and try again.'
        )
      } else if (
        error.code ===
        'auth/api-key-not-valid'
      ) {
        setError(
          'Firebase Authentication is not configured correctly. Please check the Firebase project configuration.'
        )
      } else {
        setError(
          'Unable to sign in right now. Please check your connection and try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen items-center justify-center px-4 py-8">

        <div className="w-full max-w-md">

          {/* Branding */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Church size={32} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-800">
              Church Management System
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Secure access to your church administration
            </p>

          </div>

          {/* Login Card */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-800">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign in to continue to the system.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Username */}

              <div>

                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>

              {/* Login */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />

                    Sign In
                  </>
                )}

              </button>

            </form>

            {/* Security Notice */}

            <div className="mt-6 border-t border-slate-100 pt-5">

              <p className="text-center text-xs text-slate-400">
                This system is restricted to authorized
                church administrators and staff.
              </p>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Church Management System
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login