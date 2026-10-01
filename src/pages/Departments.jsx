import { useState } from 'react'
import {
  Building2,
  Plus,
  Search,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'
import AddDepartment from './AddDepartment'

function Departments() {
  const {
    departments,
    members,
    updateDepartment,
    deleteDepartment,
  } = useMembers()

  const [search, setSearch] = useState('')
  const [showAddDepartment, setShowAddDepartment] =
    useState(false)

  const [openMenu, setOpenMenu] = useState(null)
  const [editingDepartment, setEditingDepartment] =
    useState(null)

  const [editForm, setEditForm] = useState({
    name: '',
    leader: '',
    assistant: '',
    roles: '',
  })

  /* ============================================================
     FILTER DEPARTMENTS
  ============================================================ */

  const filteredDepartments = departments.filter(
    (department) => {
      const searchTerm = search.toLowerCase()

      return (
        department.name
          ?.toLowerCase()
          .includes(searchTerm) ||
        department.leader
          ?.toLowerCase()
          .includes(searchTerm) ||
        department.assistant
          ?.toLowerCase()
          .includes(searchTerm)
      )
    }
  )

  /* ============================================================
     MEMBER COUNT
  ============================================================ */

  const memberCount = (departmentName) =>
    members.filter(
      (member) =>
        member.department === departmentName
    ).length

  /* ============================================================
     SUMMARY
  ============================================================ */

  const totalServants = members.filter(
    (member) => member.department
  ).length

  const totalRoles = departments.reduce(
    (count, department) =>
      count + (department.roles?.length || 0),
    0
  )

  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */

  const handleEditOpen = (department) => {
    setEditingDepartment(department)

    setEditForm({
      name: department.name || '',
      leader: department.leader || '',
      assistant: department.assistant || '',
      roles: department.roles?.join(', ') || '',
    })

    setOpenMenu(null)
  }

  /* ============================================================
     HANDLE EDIT FORM
  ============================================================ */

  const handleEditChange = (field, value) => {
    setEditForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  /* ============================================================
     SAVE DEPARTMENT
  ============================================================ */

  const handleEditSubmit = (event) => {
    event.preventDefault()

    const cleanName = editForm.name.trim()

    if (!cleanName) {
      return
    }

    const roles = editForm.roles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean)

    updateDepartment(
      editingDepartment.id,
      {
        name: cleanName,
        leader: editForm.leader.trim(),
        assistant: editForm.assistant.trim(),
        roles,
      }
    )

    setEditingDepartment(null)
  }

  /* ============================================================
     DELETE DEPARTMENT
  ============================================================ */

  const handleDelete = (department) => {
    const count = memberCount(department.name)

    const message =
      count > 0
        ? `Remove "${department.name}"?\n\n${count} member${
            count === 1 ? '' : 's'
          } currently belong to this department. They will become unassigned.`
        : `Remove "${department.name}"?`

    const confirmed = window.confirm(message)

    if (!confirmed) {
      return
    }

    deleteDepartment(department.id)

    setOpenMenu(null)
  }

  return (
    <div className="space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Departments
          </h1>

          <p className="mt-1 text-slate-500">
            Manage church departments, leaders and servants.
          </p>
        </div>

        <button
          onClick={() =>
            setShowAddDepartment(true)
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Department
        </button>

      </div>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">

            <Building2
              size={20}
              className="text-blue-600"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Departments
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {departments.length}
              </p>
            </div>

          </div>
        </div>

        <div className="border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">

            <Users
              size={20}
              className="text-green-600"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Assigned Members
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalServants}
              </p>
            </div>

          </div>
        </div>

        <div className="border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">

            <Users
              size={20}
              className="text-purple-600"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Department Roles
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalRoles}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================
          SEARCH
      ======================================================== */}

      <div className="border border-slate-200 bg-white p-4">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search departments, leaders..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* ========================================================
          DEPARTMENT TABLE
      ======================================================== */}

      <div className="overflow-hidden border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-left">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Leader
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assistant
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Members
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Roles
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredDepartments.map((department) => {

                const count = memberCount(
                  department.name
                )

                return (
                  <tr
                    key={department.id}
                    className="hover:bg-slate-50"
                  >

                    {/* Department */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <Building2
                            size={20}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {department.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Department
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Leader */}

                    <td className="px-6 py-5">

                      {department.leader ? (
                        <span className="text-sm font-medium text-slate-900">
                          {department.leader}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}

                    </td>

                    {/* Assistant */}

                    <td className="px-6 py-5">

                      {department.assistant ? (
                        <span className="text-sm text-slate-700">
                          {department.assistant}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}

                    </td>

                    {/* Members */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <Users
                          size={17}
                          className="text-slate-400"
                        />

                        <span className="font-semibold text-slate-900">
                          {count}
                        </span>

                        <span className="text-sm text-slate-500">
                          {count === 1
                            ? 'member'
                            : 'members'}
                        </span>

                      </div>

                    </td>

                    {/* Roles */}

                    <td className="px-6 py-5">

                      {department.roles?.length > 0 ? (

                        <div className="flex max-w-xs flex-wrap gap-1.5">

                          {department.roles.map(
                            (role) => (
                              <span
                                key={role}
                                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                              >
                                {role}
                              </span>
                            )
                          )}

                        </div>

                      ) : (

                        <span className="text-sm text-slate-400">
                          No roles
                        </span>

                      )}

                    </td>

                    {/* Actions */}

                    <td className="relative px-6 py-5">

                      <div className="flex justify-end">

                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === department.id
                                ? null
                                : department.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical size={19} />
                        </button>

                      </div>

                      {openMenu === department.id && (

                        <div className="absolute right-6 top-14 z-20 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">

                          <button
                            onClick={() =>
                              handleEditOpen(
                                department
                              )
                            }
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil size={16} />
                            Edit Department
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                department
                              )
                            }
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Remove Department
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

        {/* Empty State */}

        {filteredDepartments.length === 0 && (

          <div className="border-t border-slate-100 py-16 text-center">

            <Building2
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              No departments found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching for another department.
            </p>

          </div>

        )}

      </div>

      {/* ========================================================
          ADD DEPARTMENT
      ======================================================== */}

      {showAddDepartment && (
        <AddDepartment
          onClose={() =>
            setShowAddDepartment(false)
          }
        />
      )}

      {/* ========================================================
          EDIT DEPARTMENT MODAL
      ======================================================== */}

      {editingDepartment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Department
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update department details and leadership.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingDepartment(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleEditSubmit}
              className="space-y-5 p-6"
            >

              {/* Department Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department Name
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    handleEditChange(
                      'name',
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Leader */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department Leader
                </label>

                <input
                  type="text"
                  value={editForm.leader}
                  onChange={(event) =>
                    handleEditChange(
                      'leader',
                      event.target.value
                    )
                  }
                  placeholder="Enter leader name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Assistant */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Assistant
                </label>

                <input
                  type="text"
                  value={editForm.assistant}
                  onChange={(event) =>
                    handleEditChange(
                      'assistant',
                      event.target.value
                    )
                  }
                  placeholder="Enter assistant name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Roles */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department Roles
                </label>

                <input
                  type="text"
                  value={editForm.roles}
                  onChange={(event) =>
                    handleEditChange(
                      'roles',
                      event.target.value
                    )
                  }
                  placeholder="e.g. Keyboardist, Singer, Sound"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Separate multiple roles with commas.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setEditingDepartment(null)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Departments