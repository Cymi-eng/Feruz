import { useState } from 'react'
import {
  UserRound,
  Search,
  Plus,
  MoreVertical,
  Users,
  X,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function Community() {
  const {
    members,
    addMember,
    departments,
    groups,
  } = useMembers()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    group: '',
  })

  const communityMembers = members.filter(
    (member) => member.type === 'community'
  )

  const filteredMembers = communityMembers.filter((member) => {
    const searchTerm = search.toLowerCase()

    return (
      member.name?.toLowerCase().includes(searchTerm) ||
      member.email?.toLowerCase().includes(searchTerm) ||
      member.department?.toLowerCase().includes(searchTerm) ||
      member.phone?.toLowerCase().includes(searchTerm) ||
      member.group?.toLowerCase().includes(searchTerm)
    )
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return
    }

    addMember({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      type: 'community',
      department: formData.department,
      group: formData.group,
    })

    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      group: '',
    })

    setShowForm(false)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <UserRound size={25} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Community Members
            </h1>

          </div>

          <p className="mt-2 text-slate-500">
            Manage members from the church community.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Community Member
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Community
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {communityMembers.length}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Active Members
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {
              communityMembers.filter(
                (member) => member.status === 'Active'
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Serving
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {
              communityMembers.filter(
                (member) => member.department
              ).length
            }
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">

        <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-2.5 max-w-lg">

          <Search
            size={19}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search community members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />

        </div>

      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b border-slate-200">

          <div>
            <h2 className="font-semibold text-slate-800">
              Community Members
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={17} />
            {filteredMembers.length}
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Member
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Phone
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Accountability
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>

                <th></th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredMembers.length > 0 ? (

                filteredMembers.map((member) => (

                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Member */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-600 rounded-full font-semibold">

                          {(member.name || '?')
                            .split(' ')
                            .filter(Boolean)
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}

                        </div>

                        <div>

                          <p className="font-medium text-slate-700">
                            {member.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {member.email || 'No email'}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.phone || '—'}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">

                      {member.department ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                          {member.department}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}

                    </td>

                    {/* Accountability */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.group || 'Not assigned'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700">
                        {member.status || 'Active'}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <button
                        type="button"
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        <MoreVertical
                          size={18}
                          className="text-slate-500"
                        />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >

                    <UserRound
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-medium text-slate-600">
                      No community members found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {search
                        ? 'Try changing your search.'
                        : 'Add your first community member.'}
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add Community Member Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Add Community Member
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Add a new member to the church community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} className="text-slate-500" />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0712 345 678"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="member@example.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select department
                    </option>

                    {departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.name}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Accountability Group
                  </label>

                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select group
                    </option>

                    {groups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Community