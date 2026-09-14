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
      path: '/groups',
      icon: UsersRound,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">

      {/* Logo */}

      <div className="flex items-center gap-3 h-20 px-6 border-b border-slate-800">

        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          ⛪
        </div>

        <div>
          <h1 className="font-bold">
            Church System
          </h1>

          <p className="text-xs text-slate-400">
            Management Portal
          </p>
        </div>

      </div>


      {/* Navigation */}

      <div className="px-4 py-6">

        <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">

        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <button className="flex items-center gap-3 w-full px-3 py-3 mt-1 text-sm text-red-400 hover:bg-slate-800 rounded-lg">
          <LogOut size={19} />
          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar