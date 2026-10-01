jsx
import {
  LayoutDashboard,
  Users,
  UserRound,
  UsersRound,
  Building2,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import churchLogo from '../assets/rhsf.jpeg'

function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate()

  const navigation = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      name: 'Members',
      icon: Users,
      path: '/members',
    },
    {
      name: 'Departments',
      icon: Building2,
      path: '/departments',
    },
    {
      name: 'Groups',
      icon: UsersRound,
      path: '/groups',
    },
    {
      name: 'Attendance',
      icon: UserRound,
      path: '/attendance',
    },
    {
      name: 'Giving',
      icon: Wallet,
      path: '/giving',
    },
    {
      name: 'Reports',
      icon: BarChart3,
      path: '/reports',
    },
  ]

  const handleNavigation = (item) => {
    setActivePage?.(item.name)
    navigate(item.path)
    onClose?.()
  }

  const handleLogout = () => {
    localStorage.removeItem('church-auth')
    navigate('/login')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
            <img
              src={churchLogo}
              alt="Church logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-800">
              Church System
            </h1>

            <p className="truncate text-xs text-slate-500">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive =
              activePage === item.name ||
              window.location.pathname === item.path

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigation(item)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

