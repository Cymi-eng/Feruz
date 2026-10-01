import { useEffect, useState } from 'react'
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

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  /* ============================================================
     CLOSE ROW MENU ON OUTSIDE TAP / CLICK
  ============================================================ */

  useEffect(() => {
    if (openMenu === null) return

    const handlePointerDown = (event) => {
      if (!event.target.closest('[data-row-menu]')) {
        setOpenMenu(null)
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    )

    return () =>
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      )
  }, [openMenu])

  /* ============================================================
     LOCK PAGE SCROLL WHILE EDIT MODAL IS OPEN
  ============================================================ */

  useEffect(() => {
    if (!editingDepartment) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [editingDepartment])

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

    setError('')
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

    setError('')
  }

  /* ============================================================
     SAVE DEPARTMENT
  ============================================================ */

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) return

    const cleanName = editForm.name.trim()

    if (!cleanName) {
      setError('Department name is required.')
      return
    }

    const roles = editForm.roles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean)

    setError('')
    setIsSaving(true)

    try {
      await updateDepartment(
        editingDepartment.id,
        {
          name: cleanName,
          leader: editForm.leader.trim(),
          assistant: editForm.assistant.trim(),
          roles,
        }
      )

      setEditingDepartment(null)
    } catch (err) {
      console.error(
        'Failed to update department:',
        err
      )

      setError(
        'The department could not be updated. Please check your Firebase connection and try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  /* ============================================================
     DELETE DEPARTMENT
  ============================================================ */

  const handleDelete = async (department) => {
    if (isSaving) return

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

    setIsSaving(true)

    try {
      await deleteDepartment(department.id)

      setOpenMenu(null)
    } catch (err) {
      console.error(
        'Failed to delete department:',
        err
      )

      window.alert(
        'The department could not be removed. Please check your Firebase connection and try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  // text-base on phones stops iOS from zooming into inputs on focus
  const inputClass =
    'w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm'

  const menuProps = {
    openMenu,
    setOpenMenu,
    onEdit: handleEditOpen,
    onDelete: handleDelete,
  }

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Departments
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Manage church departments, leaders and servants.
          </p>
        </div>

        <button
          onClick={() =>
            setShowAddDepartment(true)
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Add Department
        </button>

      </div>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">

        <div className="col-span-2 border border-slate-200 bg-white px-4 py-4 sm:px-5 md:col-span-1">
          <div className="flex items-center gap-3">

            <Building2
              size={20}
              className="shrink-0 text-blue-600"
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

        <div className="border border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">

            <Users
              size={20}
              className="shrink-0 text-green-600"
            />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Assigned
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalServants}
              </p>
            </div>

          </div>
        </div>

        <div className="border border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">

            <Users
              size={20}
              className="shrink-0 text-purple-600"
            />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Roles
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

      <div className="border border-slate-200 bg-white p-3 sm:p-4">

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
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm"
          />

        </div>

      </div>

      {/* ========================================================
          DEPARTMENTS
      ======================================================== */}

      <div className="border border-slate-200 bg-white">

        {/* Phones and tablets: card list */}

        {filteredDepartments.length > 0 && (

          <ul className="divide-y divide-slate-100 lg:hidden">

            {filteredDepartments.map((department) => {

              const count = memberCount(
                department.name
              )

              return (
                <li
                  key={department.id}
                  className="p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Building2
                        size={20}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {department.name}
                      </p>

                      <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                        <Users
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="font-semibold text-slate-900">
                          {count}
                        </span>

                        {count === 1
                          ? 'member'
                          : 'members'}
                      </div>
                    </div>

                    <RowMenu
                      department={department}
                      {...menuProps}
                    />

                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">

                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Leader
                      </dt>

                      <dd
                        className={`mt-1 break-words ${
                          department.leader
                            ? 'font-medium text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {department.leader ||
                          'Not assigned'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Assistant
                      </dt>

                      <dd
                        className={`mt-1 break-words ${
                          department.assistant
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {department.assistant ||
                          'Not assigned'}
                      </dd>
                    </div>

                  </dl>

                  <div className="mt-3 flex flex-wrap gap-1.5">

                    {department.roles?.length > 0 ? (
                      department.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No roles
                      </span>
                    )}

                  </div>

                </li>
              )
            })}

          </ul>

        )}

        {/* Desktop: table */}

        {filteredDepartments.length > 0 && (

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[900px] text-left">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
                    Department
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
                    Leader
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
                    Assistant
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
                    Members
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
                    Roles
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 xl:px-6">
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

                      <td className="px-5 py-5 xl:px-6">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
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

                      <td className="px-5 py-5 xl:px-6">

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

                      <td className="px-5 py-5 xl:px-6">

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

                      <td className="px-5 py-5 xl:px-6">

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

                      <td className="px-5 py-5 xl:px-6">

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

                      <td className="px-5 py-5 xl:px-6">

                        <div className="flex justify-end">
                          <RowMenu
                            department={department}
                            {...menuProps}
                          />
                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        )}

        {/* Empty State */}

        {filteredDepartments.length === 0 && (

          <div className="px-6 py-14 text-center sm:py-16">

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

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:px-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!isSaving) {
                setEditingDepartment(null)
              }
            }
          }}
        >

          <div className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[90dvh] sm:rounded-xl">

            {/* Header */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Department
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update department details and leadership.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingDepartment(null)
                }
                disabled={isSaving}
                aria-label="Close"
                className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleEditSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">

                {/* Error */}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

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
                    className={inputClass}
                    required
                    disabled={isSaving}
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
                    className={inputClass}
                    disabled={isSaving}
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
                    className={inputClass}
                    disabled={isSaving}
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
                    className={inputClass}
                    disabled={isSaving}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Separate multiple roles with commas.
                  </p>
                </div>

              </div>

              {/* Buttons */}

              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4">

                <button
                  type="button"
                  onClick={() =>
                    setEditingDepartment(null)
                  }
                  disabled={isSaving}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2.5"
                >
                  {isSaving
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

/* ============================================================
   ROW ACTIONS MENU
============================================================ */

function RowMenu({
  department,
  openMenu,
  setOpenMenu,
  onEdit,
  onDelete,
}) {
  const isOpen = openMenu === department.id

  return (
    <div
      data-row-menu
      className="relative inline-block text-left"
    >

      <button
        type="button"
        onClick={() =>
          setOpenMenu(
            isOpen
              ? null
              : department.id
          )
        }
        aria-label={`Actions for ${department.name}`}
        aria-expanded={isOpen}
        className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:p-2"
      >
        <MoreVertical size={19} />
      </button>

      {isOpen && (

        <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">

          <button
            type="button"
            onClick={() =>
              onEdit(department)
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 lg:py-2.5"
          >
            <Pencil size={16} />
            Edit Department
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(department)
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 lg:py-2.5"
          >
            <Trash2 size={16} />
            Remove Department
          </button>

        </div>

      )}

    </div>
  )
}

export default Departments