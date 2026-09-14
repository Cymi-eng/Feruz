import { useState } from 'react'
import {
  UserRound,
  Search,
  Plus,
  MoreVertical,
  Users,
} from 'lucide-react'

import { members } from '../data/members'

function Community() {
  const [search, setSearch] = useState('')

  const communityMembers = members.filter(
    (member) => member.type === 'community'
  )

  const filteredMembers = communityMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.department.toLowerCase().includes(search.toLowerCase())
    )
  })

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

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">

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

                          {member.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)}

                        </div>

                        <div>

                          <p className="font-medium text-slate-700">
                            {member.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {member.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Phone */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.phone}
                    </td>


                    {/* Department */}

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {member.department}
                      </span>

                    </td>


                    {/* Accountability */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.group}
                    </td>


                    {/* Status */}

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700">
                        {member.status}
                      </span>

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-4">

                      <button className="p-2 hover:bg-slate-100 rounded-lg">

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
                      Try changing your search.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Community