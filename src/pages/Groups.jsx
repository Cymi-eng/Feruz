import { useState } from 'react'
import {
  UsersRound,
  Plus,
  Search,
  MoreVertical,
  UserRound,
} from 'lucide-react'

const groups = [
  {
    id: 1,
    name: 'Grace Group',
    leader: 'John Kamau',
    assistant: 'Jane Chebet',
    members: 12,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Faith Group',
    leader: 'Mary Wanjiku',
    assistant: 'Samuel Mwangi',
    members: 15,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Hope Group',
    leader: 'Peter Kiptoo',
    assistant: 'Grace Njeri',
    members: 10,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Victory Group',
    leader: 'David Ochieng',
    assistant: 'Mercy Akinyi',
    members: 14,
    status: 'Active',
  },
]

function Groups() {
  const [search, setSearch] = useState('')

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    group.leader.toLowerCase().includes(search.toLowerCase())
  )

  const totalMembers = groups.reduce(
    (total, group) => total + group.members,
    0
  )

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Accountability Groups
          </h1>

          <p className="mt-1 text-slate-500">
            Organize members into accountability and fellowship groups.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={18} />
          Add Group
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-100 p-3">
              <UsersRound className="text-blue-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Groups
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {groups.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-green-100 p-3">
              <UserRound className="text-green-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Members Assigned
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalMembers}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-purple-100 p-3">
              <UsersRound className="text-purple-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Active Groups
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {groups.filter((group) => group.status === 'Active').length}
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
            placeholder="Search groups or leaders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* Groups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {filteredGroups.map((group) => (

          <div
            key={group.id}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <UsersRound
                    className="text-blue-600"
                    size={24}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    {group.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {group.members} members
                  </p>
                </div>

              </div>

              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <MoreVertical size={20} />
              </button>

            </div>

            {/* Leadership */}
            <div className="mt-6 space-y-3">

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Group Leader
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {group.leader}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Assistant Leader
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {group.assistant}
                </span>
              </div>

            </div>

            {/* Status */}
            <div className="mt-5 flex items-center justify-between">

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {group.status}
              </span>

            </div>

          </div>

        ))}

      </div>

      {filteredGroups.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">

          <UsersRound
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 font-semibold text-slate-700">
            No groups found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try searching for another group.
          </p>

        </div>
      )}

    </div>
  )
}

export default Groups