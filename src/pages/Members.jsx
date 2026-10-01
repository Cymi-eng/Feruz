import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  RefreshCw,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function Members() {
  const navigate = useNavigate()

  const {
    members = [],
    loading,
  } = useMembers()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      setShowLoading(false)
    }
  }, [loading])

  const filteredMembers = members.filter((member) => {
    const name = member.name || ''
    const email = member.email || ''
    const admissionNumber =
      member.admissionNumber ||
      member.admission_number ||
      ''

    const searchValue = search.toLowerCase()

    const matchesSearch =
      name.toLowerCase().includes(searchValue) ||
      email.toLowerCase().includes(searchValue) ||
      admissionNumber.toLowerCase().includes(searchValue)

    const matchesFilter =
      filter === 'all' ||
      member.type === filter

    return matchesSearch && matchesFilter
  })

  const students = members.filter(
    (member) => member.type === 'student'
  ).length

  const community = members.filter(
    (member) => member.type === 'community'
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Members
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all church members.
          </p>
        </div>

        <button
          onClick={() => navigate('/members/add')}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Member
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Members
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {members.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Students
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {students}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Community
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {community}
          </p>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5 md:w-96">

            <Search
              size={19}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none"
            />

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter('student')}
              className={`rounded-lg px-4 py-2 text-sm ${
                filter === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Students
            </button>

            <button
              onClick={() => setFilter('community')}
              className={`rounded-lg px-4 py-2 text-sm ${
                filter === 'community'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Community
            </button>

          </div>

        </div>

      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        {showLoading ? (

          <div className="py-16 text-center">

            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-blue-600"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              Loading members...
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Connecting to Firebase.
            </p>

          </div>

        ) : (

          <>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Member
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Year
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Accountability
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4"></th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredMembers.map((member) => {

                    const initials =
                      (member.name || 'NA')
                        .split(' ')
                        .filter(Boolean)
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()

                    return (

                      <tr
                        key={member.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* MEMBER */}
                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">

                              {initials}

                            </div>

                            <div>

                              <p className="font-medium text-slate-700">
                                {member.name || 'No name'}
                              </p>

                              <p className="text-xs text-slate-400">
                                {member.email || 'No email'}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* TYPE */}
                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              member.type === 'student'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {member.type === 'student'
                              ? 'Student'
                              : 'Community'}
                          </span>

                        </td>

                        {/* YEAR */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {member.year || '—'}
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {member.department || '—'}
                        </td>

                        {/* GROUP */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {member.group ||
                            member.accountabilityGroup ||
                            '—'}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              member.status === 'Inactive'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {member.status || 'Active'}
                          </span>

                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">

                          <button
                            className="rounded-lg p-2 hover:bg-slate-100"
                            title="More actions"
                          >
                            <MoreVertical
                              size={18}
                              className="text-slate-500"
                            />
                          </button>

                        </td>

                      </tr>

                    )
                  })}

                </tbody>

              </table>

            </div>

            {filteredMembers.length === 0 && (

              <div className="py-16 text-center">

                <Users
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-700">
                  No members found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {members.length === 0
                    ? 'No members have been added yet.'
                    : 'Try changing your search or filter.'}
                </p>

              </div>

            )}

          </>

        )}

      </div>

    </div>
  )
}

export default Members