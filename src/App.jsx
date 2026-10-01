import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { MemberProvider } from './context/MemberContext'

import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import AddMember from './pages/AddMember'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import Community from './pages/Community'
import AddCommunity from './pages/AddCommunity'
import Departments from './pages/Departments'
import AddDepartment from './pages/AddDepartment'
import Groups from './pages/Groups'
import AddGroup from './pages/AddGroup'
import Settings from './pages/Settings'

const AUTH_STORAGE_KEY = 'church-auth'

function getAuthenticationStatus() {
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

function ProtectedRoutes() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(getAuthenticationStatus)

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(
        getAuthenticationStatus()
      )
    }

    window.addEventListener(
      'storage',
      handleStorageChange
    )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      )
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <DashboardLayout />
  )
}

function App() {
  return (
    <MemberProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login */}

          <Route
            path="/login"
            element={
              getAuthenticationStatus() ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Protected System */}

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/members/add"
              element={<AddMember />}
            />

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/students/add"
              element={<AddStudent />}
            />

            <Route
              path="/community"
              element={<Community />}
            />

            <Route
              path="/community/add"
              element={<AddCommunity />}
            />

            <Route
              path="/departments"
              element={<Departments />}
            />

            <Route
              path="/departments/add"
              element={<AddDepartment />}
            />

            <Route
              path="/groups"
              element={<Groups />}
            />

            <Route
              path="/groups/add"
              element={<AddGroup />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>

          {/* Unknown routes */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </MemberProvider>
  )
}

export default App