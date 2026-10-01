import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound,
  Search,
  Plus,
  MoreVertical,
  Users,
  Phone,
  Mail,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function getInitials(name) {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Community() {
  const navigate = useNavigate()

  const { members } = useMembers()

  const [search, setSearch] = useState('')

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

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">
          <div className="flex items-center gap-3">

            <div className="shrink-0 rounded-lg bg-slate-100 p-2.5 text-slate-600 sm:p-3">
              <UserRound size={25} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Community Members
            </h1>

          </div>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage members from the church community.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/community/add')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 md:w-auto md:py-2.5"
        >
          <Plus size={18} />
          Add Community Member
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">

        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 sm:col-span-1 sm:p-5">

          <div className="flex items-center gap-3">

            <div className="shrink-0 rounded-lg bg-blue-50 p-3 text-blue-600">
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

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">

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

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">

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
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">

        <div className="flex max-w-lg items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 sm:py-2.5">

          <Search
            size={19}
            className="shrink-0 text-slate-400"
          />

          {/* text-base on phones stops iOS zooming in on focus */}
          <input
            type="text"
            placeholder="Search community members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 text-base outline-none sm:text-sm"
          />

        </div>

      </div>

      {/* Members */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-6">

          <div>

            <h2 className="font-semibold text-slate-800">
              Community Members
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? 's' : ''}
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Users size={17} />

            {filteredMembers.length}

          </div>

        </div>

        {/* Empty state (shared by card list and table) */}
        {filteredMembers.length === 0 && (
          <div className="px-6 py-12 text-center">

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

          </div>
        )}

        {/* Phones: card list */}
        {filteredMembers.length > 0 && (
          <ul className="divide-y divide-slate-100 md:hidden">

            {filteredMembers.map((member) => (

              <li key={member.id} className="p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                    {getInitials(member.name)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium text-slate-700">
                      {member.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2">

                      {member.department ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                          {member.department}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                          No department
                        </span>
                      )}

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                        {member.status || 'Active'}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label={`Actions for ${member.name}`}
                    className="-mr-1 shrink-0 rounded-lg p-2.5 hover:bg-slate-100"
                  >
                    <MoreVertical
                      size={18}
                      className="text-slate-500"
                    />
                  </button>

                </div>

                <dl className="mt-3 space-y-2 text-sm text-slate-600">

                  <div className="flex items-center gap-2">
                    <Phone
                      size={15}
                      className="shrink-0 text-slate-400"
                    />
                    <dd>
                      {member.phone ? (
                        <a
                          href={`tel:${member.phone}`}
                          className="text-blue-600"
                        >
                          {member.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail
                      size={15}
                      className="shrink-0 text-slate-400"
                    />
                    <dd className="min-w-0 truncate">
                      {member.email || 'No email'}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users
                      size={15}
                      className="shrink-0 text-slate-400"
                    />
                    <dd>
                      {member.group || 'Not assigned'}
                    </dd>
                  </div>

                </dl>

              </li>

            ))}

          </ul>
        )}

        {/* Tablet and desktop: table */}
        {filteredMembers.length > 0 && (
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[720px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-500 lg:px-6">
                    Member
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-500 lg:px-6">
                    Phone
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-500 lg:px-6">
                    Department
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-500 lg:px-6">
                    Accountability
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-500 lg:px-6">
                    Status
                  </th>

                  <th></th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredMembers.map((member) => (

                  <tr
                    key={member.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Member */}
                    <td className="px-4 py-4 lg:px-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                          {getInitials(member.name)}
                        </div>

                        <div className="min-w-0">

                          <p className="font-medium text-slate-700">
                            {member.name}
                          </p>

                          <p className="max-w-[200px] truncate text-xs text-slate-400">
                            {member.email || 'No email'}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 lg:px-6">
                      {member.phone || '—'}
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 lg:px-6">

                      {member.department ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                          {member.department}
                        </span>
                      ) : (
                        <span className="whitespace-nowrap text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}

                    </td>

                    {/* Accountability */}
                    <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                      {member.group || 'Not assigned'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 lg:px-6">

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                        {member.status || 'Active'}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 lg:px-6">

                      <button
                        type="button"
                        aria-label={`Actions for ${member.name}`}
                        className="rounded-lg p-2 hover:bg-slate-100"
                      >
                        <MoreVertical
                          size={18}
                          className="text-slate-500"
                        />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Community