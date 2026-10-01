import { useEffect, useState } from 'react'
import {
  Bell,
  Building2,
  Check,
  Globe,
  Info,
  Moon,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Sun,
  Users,
} from 'lucide-react'

const SETTINGS_STORAGE_KEY = 'church-settings'

export const DEFAULT_SETTINGS = {
  churchName: 'Church Management System',
  phone: '',
  email: '',
  location: '',
  theme: 'light',
  notifications: true,
  memberNotifications: true,
  emailNotifications: false,
}

function loadSettings() {
  try {
    const savedSettings = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    )

    if (!savedSettings) {
      return DEFAULT_SETTINGS
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      settings.theme === 'dark'
    )
  }, [settings.theme])

  const updateSetting = (field, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }))

    setSaved(false)
  }

  const saveSettings = () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    )

    window.dispatchEvent(
      new CustomEvent('church-settings-updated', {
        detail: settings,
      })
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const resetSettings = () => {
    const confirmed = window.confirm(
      'Reset all settings to their default values?'
    )

    if (!confirmed) return

    setSettings(DEFAULT_SETTINGS)

    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    )

    window.dispatchEvent(
      new CustomEvent('church-settings-updated', {
        detail: DEFAULT_SETTINGS,
      })
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
            <SettingsIcon
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your church management system preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Church Profile */}
      <section className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
          <div className="flex items-center gap-3">
            <Building2
              size={20}
              className="text-blue-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Church Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Basic information about your church.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <InputField
            label="Church Name"
            value={settings.churchName}
            placeholder="Enter church name"
            onChange={(value) =>
              updateSetting('churchName', value)
            }
          />

          <InputField
            label="Phone Number"
            type="tel"
            value={settings.phone}
            placeholder="+254 700 000 000"
            onChange={(value) =>
              updateSetting('phone', value)
            }
          />

          <InputField
            label="Email Address"
            type="email"
            value={settings.email}
            placeholder="church@example.com"
            onChange={(value) =>
              updateSetting('email', value)
            }
          />

          <InputField
            label="Location"
            value={settings.location}
            placeholder="Church location"
            onChange={(value) =>
              updateSetting('location', value)
            }
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
          <div className="flex items-center gap-3">
            {settings.theme === 'dark' ? (
              <Moon
                size={20}
                className="text-purple-600"
              />
            ) : (
              <Sun
                size={20}
                className="text-amber-500"
              />
            )}

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose how the application should appear.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ThemeButton
              active={settings.theme === 'light'}
              icon={<Sun size={20} className="text-amber-500" />}
              title="Light"
              description="Use the light interface."
              onClick={() =>
                updateSetting('theme', 'light')
              }
            />

            <ThemeButton
              active={settings.theme === 'dark'}
              icon={
                <Moon
                  size={20}
                  className="text-purple-600"
                />
              }
              title="Dark"
              description="Use the dark interface."
              onClick={() =>
                updateSetting('theme', 'dark')
              }
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
          <div className="flex items-center gap-3">
            <Bell
              size={20}
              className="text-green-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Control notification preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <SettingToggle
            title="System Notifications"
            description="Receive important notifications from the system."
            enabled={settings.notifications}
            onChange={(value) =>
              updateSetting('notifications', value)
            }
          />

          <SettingToggle
            title="Member Notifications"
            description="Receive notifications related to member activity."
            enabled={settings.memberNotifications}
            onChange={(value) =>
              updateSetting(
                'memberNotifications',
                value
              )
            }
          />

          <SettingToggle
            title="Email Notifications"
            description="Allow the system to send notifications by email."
            enabled={settings.emailNotifications}
            onChange={(value) =>
              updateSetting(
                'emailNotifications',
                value
              )
            }
          />
        </div>
      </section>

      {/* Member Management */}
      <section className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
          <div className="flex items-center gap-3">
            <Users
              size={20}
              className="text-purple-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Member Management
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage member-related preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <Info
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  Member records
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Member information, departments,
                  accountability groups and student records
                  are managed from their respective sections
                  of the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Information */}
      <section className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
          <div className="flex items-center gap-3">
            <Globe
              size={20}
              className="text-slate-600 dark:text-slate-300"
            />

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                System Information
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Information about this application.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <InfoItem
            label="Application"
            value="Church Management System"
          />

          <InfoItem
            label="Version"
            value="1.0.0"
          />

          <InfoItem
            label="Storage"
            value="Local Storage"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {saved && (
            <p className="flex items-center gap-2 text-sm font-medium text-green-600">
              <Check size={17} />
              Settings saved successfully.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={resetSettings}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
      />
    </div>
  )
}

function ThemeButton({
  active,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-lg border p-4 text-left transition ${
        active
          ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-slate-800">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {active && (
        <Check
          size={19}
          className="text-blue-600"
        />
      )}
    </button>
  )
}

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? 'bg-blue-600'
            : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-600">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  )
}

export default Settings