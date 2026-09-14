import { useState } from 'react'
import {
  Building2,
  Plus,
  Search,
  Users,
  MoreVertical,
} from 'lucide-react'
import { useMembers } from '../context/MemberContext'
import AddDepartment from './AddDepartment'

function Departments() {
  const { departments, members } = useMembers()
  const [search, setSearch] = useState('')
  const [showAddDepartment, setShowAddDepartment] = useState(false)

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase())
  )

  const memberCount = (departmentName) =>
    members.filter((member) => member.department === departmentName).length

  const totalServants = members.length
  const totalRoles = departments.reduce(
    (count, dept) => count + dept.roles.length,
    0
  )

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Departments
          </h1>

          <p className="mt-1 text-slate-500">
            Manage church departments, leaders and servants.
          </p>
        </div>

        <button
          onClick={() => setShowAddDepartment(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Department
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Building2 className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Departments</p>
              <p className="text-2xl font-bold text-slate-900">
                {departments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <Users className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Servants</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalServants}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <Users className="text-purple-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Department Roles</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalRoles}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Departments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {filteredDepartments.map((department) => (

          <div
            key={department.id}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Building2 className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {department.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {memberCount(department.name)} servants
                  </p>
                </div>
              </div>

              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Leader</span>
                <span className="text-sm font-medium text-slate-900">
                  {department.leader || '—'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Assistant</span>
                <span className="text-sm font-medium text-slate-900">
                  {department.assistant || '—'}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Department Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {department.roles.length > 0 ? (
                  department.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No roles yet</span>
                )}
              </div>
            </div>

          </div>

        ))}

      </div>

      {filteredDepartments.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Building2 size={40} className="mx-auto text-slate-300" />
          <h3 className="mt-4 font-semibold text-slate-700">
            No departments found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try searching for another department.
          </p>
        </div>
      )}

      {showAddDepartment && (
        <AddDepartment onClose={() => setShowAddDepartment(false)} />
      )}

    </div>
  )
}

export default Departments