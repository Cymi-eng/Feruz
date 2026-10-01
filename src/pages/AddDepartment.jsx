import { useState } from 'react'
import { X } from 'lucide-react'
import { useMembers } from '../context/MemberContext'

function AddDepartment({ onClose }) {
  const { addDepartment } = useMembers()

  const [name, setName] = useState('')
  const [leader, setLeader] = useState('')
  const [assistant, setAssistant] = useState('')
  const [rolesInput, setRolesInput] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) return

    setError('')

    const cleanName = name.trim()
    const cleanLeader = leader.trim()
    const cleanAssistant = assistant.trim()

    if (!cleanName) {
      setError('Department name is required.')
      return
    }

    const roles = rolesInput
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean)

    setIsSaving(true)

    try {
      const department = await addDepartment({
        name: cleanName,
        leader: cleanLeader,
        assistant: cleanAssistant,
        roles,
      })

      if (!department) {
        setError(
          'A department with this name already exists.'
        )
        return
      }

      onClose()
    } catch (err) {
      console.error(
        'Failed to save department:',
        err
      )

      setError(
        'The department could not be saved. Please check your Firebase connection and try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a department and assign its leadership.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Department Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="e.g. Worship"
              required
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Leader */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department Leader
            </label>

            <input
              type="text"
              value={leader}
              onChange={(event) =>
                setLeader(event.target.value)
              }
              placeholder="Enter leader name"
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Assistant */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assistant
            </label>

            <input
              type="text"
              value={assistant}
              onChange={(event) =>
                setAssistant(event.target.value)
              }
              placeholder="Enter assistant name"
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Roles */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department Roles
            </label>

            <input
              type="text"
              value={rolesInput}
              onChange={(event) =>
                setRolesInput(event.target.value)
              }
              placeholder="e.g. Usher, Welcome Team"
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Separate multiple roles with commas.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? 'Saving...'
                : 'Add Department'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default AddDepartment