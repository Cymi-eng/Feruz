import { useState } from 'react'
import { Users, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMembers } from '../context/MemberContext'

function AddGroup() {
  const navigate = useNavigate()
  const { addGroup } = useMembers()

  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    addGroup(name)

    alert('Group added successfully!')

    navigate('/groups')
  }

  return (
    <div className="max-w-lg space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => navigate('/groups')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Add Group
          </h1>

          <p className="mt-1 text-slate-500">
            Create a new accountability group.
          </p>
        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-8"
      >

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-lg bg-blue-100 p-3">
            <Users
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Group Details
            </h2>

            <p className="text-sm text-slate-500">
              Give the group a name.
            </p>
          </div>

        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Group Name
          </label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grace Group"
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-6">

          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Group
          </button>

        </div>

      </form>

    </div>
  )
}

export default AddGroup