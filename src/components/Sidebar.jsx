
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserRound,
  Building2,
  UsersRound,
  Settings,
  LogOut,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

import churchLogo from '../assets/rhsf.jpeg'

function Sidebar() {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'All Members',
      path: '/members',
      icon: Users,
    },
    {
      name: 'Students',
      path: '/students',
      icon: GraduationCap,
    },
    {
      name: 'Community',
      path: '/community',
      icon: UserRound,
    },
    {
      name: 'Departments',
      path: '/departments',
      icon: Building2,
    },
    {
      name: 'Accountability',
      path: '/accountability',
      icon: UsersRound,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">

      {/* Logo */}

      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-blue-500/30">
          <img
            src={churchLogo}
            alt="Fellowship logo"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h1 className="truncate font-bold">
            Fellowship-Records-Syystem
          </h1>

          <p className="text-xs text-slate-400">
            Management Portal
          </p>
        </div>

      </div>

      {/* Navigation */}

      <div className="px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />

                {item.name}
              </NavLink>
            )
          })}

        </nav>

      </div>

      {/* Bottom */}

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          <Settings size={19} />

          Settings
        </NavLink>

        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-slate-800"
        >
          <LogOut size={19} />

          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar

