import { useState } from 'react'
import { X } from 'lucide-react'
import { useMembers } from '../context/MemberContext'

function AddDepartment({ onClose }) {
  const { addDepartment } = useMembers()

  const [name, setName] = useState('')
  const [leader, setLeader] = useState('')
  const [assistant, setAssistant] = useState('')
  const [rolesInput, setRolesInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) return

    const roles = rolesInput
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean)

    addDepartment({ name: name.trim(), leader, assistant, roles })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Add Department
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Leader
            </label>
            <input
              type="text"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Assistant
            </label>
            <input
              type="text"
              value={assistant}
              onChange={(e) => setAssistant(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Roles <span className="text-slate-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="e.g. Usher, Welcome Team"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Department
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default AddDepartment