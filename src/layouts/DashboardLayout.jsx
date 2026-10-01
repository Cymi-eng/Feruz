import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const SETTINGS_STORAGE_KEY = 'church-settings'

const DEFAULT_SETTINGS = {
  churchName: 'Church Management System',
  theme: 'light',
}

function getSettings() {
  try {
    const saved = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    )

    if (!saved) {
      return DEFAULT_SETTINGS
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(getSettings)

  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      if (!event.detail) return

      setSettings((currentSettings) => ({
        ...currentSettings,
        ...event.detail,
      }))
    }

    window.addEventListener(
      'church-settings-updated',
      handleSettingsUpdate
    )

    return () => {
      window.removeEventListener(
        'church-settings-updated',
        handleSettingsUpdate
      )
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      settings.theme === 'dark'
    )
  }, [settings.theme])

  return (
    <div
      className={`min-h-screen transition-colors ${
        settings.theme === 'dark'
          ? 'bg-slate-950 text-white'
          : 'bg-gray-100 text-slate-900'
      }`}
    >
      {/* MOBILE HEADER */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setSidebarOpen((current) => !current)
          }
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label={
            sidebarOpen
              ? 'Close sidebar'
              : 'Open sidebar'
          }
        >
          {sidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <div className="ml-3 min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
            {settings.churchName ||
              'Church Management System'}
          </h1>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <Sidebar
          churchName={
            settings.churchName ||
            'Church Management System'
          }
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="min-h-screen px-4 pb-8 pt-20 transition-colors sm:px-6 lg:ml-64 lg:px-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout