import { useEffect, useState } from 'react'
import {
  UsersRound,
  Users,
  Pencil,
  X,
  Search,
  UserRound,
} from 'lucide-react'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'

import { db } from '../firebase'
import { useMembers } from '../context/MemberContext'

const DEFAULT_GROUPS = [
  'Group 1',
  'Group 2',
  'Group 3',
  'Group 4',
  'Group 5',
  'Group 6',
  'Group 7',
]

function Accountability() {
  const {
    members,
    updateMember,
  } = useMembers()

  const [groups, setGroups] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [editingGroup, setEditingGroup] =
    useState(null)

  const [editForm, setEditForm] = useState({
    name: '',
    leader: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  /* ============================================================
     LOAD / CREATE THE SEVEN ACCOUNTABILITY GROUPS
  ============================================================ */

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true)

      try {
        const snapshot = await getDocs(
          collection(db, 'groups')
        )

        const existingGroups = snapshot.docs.map(
          (groupDoc) => ({
            id: groupDoc.id,
            ...groupDoc.data(),
          })
        )

        const loadedGroups = []

        for (const defaultName of DEFAULT_GROUPS) {
          const existing = existingGroups.find(
            (group) => group.name === defaultName
          )

          if (existing) {
            loadedGroups.push(existing)
            continue
          }

          const groupData = {
            name: defaultName,
            leader: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const groupRef = await addDoc(
            collection(db, 'groups'),
            groupData
          )

          loadedGroups.push({
            id: groupRef.id,
            ...groupData,
          })
        }

        /*
         * Keep the seven standard groups visible.
         * Any additional groups already in Firestore are
         * also retained so existing data is not lost.
         */

        const additionalGroups =
          existingGroups.filter(
            (group) =>
              !DEFAULT_GROUPS.includes(group.name)
          )

        setGroups([
          ...loadedGroups,
          ...additionalGroups,
        ])
      } catch (err) {
        console.error(
          'Failed to load accountability groups:',
          err
        )

        setError(
          'Unable to load accountability groups. Please check your Firebase connection.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadGroups()
  }, [])

  /* ============================================================
     GROUP MEMBER COUNT
  ============================================================ */

  const getGroupMembers = (groupName) =>
    members.filter(
      (member) =>
        member.group === groupName
    )

  const getMemberCount = (groupName) =>
    getGroupMembers(groupName).length

  /* ============================================================
     SEARCH
  ============================================================ */

  const filteredGroups = groups.filter(
    (group) =>
      group.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      group.leader
        ?.toLowerCase()
        .includes(search.toLowerCase())
  )

  /* ============================================================
     SUMMARY
  ============================================================ */

  const totalGroupMembers = groups.reduce(
    (total, group) =>
      total + getMemberCount(group.name),
    0
  )

  const groupsWithLeaders = groups.filter(
    (group) => group.leader?.trim()
  ).length

  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */

  const handleEditOpen = (group) => {
    setEditingGroup(group)

    setEditForm({
      name: group.name || '',
      leader: group.leader || '',
    })

    setError('')
  }

  /* ============================================================
     EDIT FORM
  ============================================================ */

  const handleEditChange = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))

    setError('')
  }

  /* ============================================================
     SAVE GROUP
  ============================================================ */

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (isSaving || !editingGroup) {
      return
    }

    const cleanName = editForm.name.trim()
    const cleanLeader = editForm.leader.trim()

    if (!cleanName) {
      setError('Group name is required.')
      return
    }

    /*
     * Prevent duplicate group names.
     */

    const duplicate = groups.find(
      (group) =>
        group.id !== editingGroup.id &&
        group.name.toLowerCase() ===
          cleanName.toLowerCase()
    )

    if (duplicate) {
      setError(
        'A group with this name already exists.'
      )
      return
    }

    setIsSaving(true)
    setError('')

    try {
      /*
       * Update the group document in Firestore.
       */

      await updateDoc(
        doc(db, 'groups', editingGroup.id),
        {
          name: cleanName,
          leader: cleanLeader,
          updatedAt:
            new Date().toISOString(),
        }
      )

      /*
       * If the group name changed, move all members
       * from the old group to the new group.
       */

      if (
        editingGroup.name !== cleanName
      ) {
        const affectedMembers =
          getGroupMembers(
            editingGroup.name
          )

        await Promise.all(
          affectedMembers.map((member) =>
            updateMember(member.id, {
              group: cleanName,
            })
          )
        )
      }

      /*
       * Update the local group list immediately.
       */

      setGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === editingGroup.id
            ? {
                ...group,
                name: cleanName,
                leader: cleanLeader,
                updatedAt:
                  new Date().toISOString(),
              }
            : group
        )
      )

      setEditingGroup(null)
    } catch (err) {
      console.error(
        'Failed to update accountability group:',
        err
      )

      setError(
        'The group could not be updated. Please check your Firebase connection and try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const handleClose = () => {
    if (isSaving) return

    setEditingGroup(null)
    setError('')
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Accountability Groups
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Manage the seven church accountability groups,
          their leaders and members.
        </p>
      </div>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">

        {/* Groups */}

        <div className="col-span-2 border border-slate-200 bg-white px-4 py-4 sm:px-5 md:col-span-1">

          <div className="flex items-center gap-3">

            <UsersRound
              size={20}
              className="shrink-0 text-blue-600"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Groups
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {groups.length}
              </p>
            </div>

          </div>

        </div>

        {/* Members */}

        <div className="border border-slate-200 bg-white px-4 py-4 sm:px-5">

          <div className="flex items-center gap-3">

            <Users
              size={20}
              className="shrink-0 text-green-600"
            />

            <div className="min-w-0">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Members
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalGroupMembers}
              </p>

            </div>

          </div>

        </div>

        {/* Leaders */}

        <div className="border border-slate-200 bg-white px-4 py-4 sm:px-5">

          <div className="flex items-center gap-3">

            <UserRound
              size={20}
              className="shrink-0 text-purple-600"
            />

            <div className="min-w-0">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Leaders
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {groupsWithLeaders}
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
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search groups or leaders..."
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm"
          />

        </div>

      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && !editingGroup && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ========================================================
          GROUPS
      ======================================================== */}

      <div className="border border-slate-200 bg-white">

        {loading ? (

          <div className="px-6 py-14 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading accountability groups...
            </p>

          </div>

        ) : filteredGroups.length > 0 ? (

          <div className="divide-y divide-slate-100">

            {filteredGroups.map((group) => {

              const count =
                getMemberCount(group.name)

              const groupMembers =
                getGroupMembers(group.name)

              return (
                <div
                  key={group.id}
                  className="p-4 sm:p-5 lg:p-6"
                >

                  {/* ==================================================
                      GROUP HEADER
                  ================================================== */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                        <UsersRound
                          size={21}
                          className="text-blue-600"
                        />

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                          {group.name}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                          Accountability Group
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleEditOpen(group)
                      }
                      className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      <span className="hidden sm:inline">
                        Edit
                      </span>
                    </button>

                  </div>

                  {/* ==================================================
                      GROUP DETAILS
                  ================================================== */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    {/* Leader */}

                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">

                      <div className="flex items-center gap-2">

                        <UserRound
                          size={17}
                          className="text-slate-400"
                        />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Group Leader
                        </p>

                      </div>

                      <p
                        className={`mt-2 text-sm ${
                          group.leader
                            ? 'font-semibold text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {group.leader ||
                          'Leader not assigned'}
                      </p>

                    </div>

                    {/* Members */}

                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">

                      <div className="flex items-center gap-2">

                        <Users
                          size={17}
                          className="text-slate-400"
                        />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Total Members
                        </p>

                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {count}{' '}
                        {count === 1
                          ? 'member'
                          : 'members'}
                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      MEMBERS
                  ================================================== */}

                  <div className="mt-4">

                    <div className="mb-2 flex items-center justify-between">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Group Members
                      </p>

                      <span className="text-xs text-slate-400">
                        {count} total
                      </span>

                    </div>

                    {groupMembers.length > 0 ? (

                      <div className="flex flex-wrap gap-2">

                        {groupMembers.map(
                          (member) => (
                            <span
                              key={member.id}
                              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                            >
                              <UserRound
                                size={13}
                              />
                              {member.name}
                            </span>
                          )
                        )}

                      </div>

                    ) : (

                      <div className="rounded-lg border border-dashed border-slate-200 px-4 py-4 text-center">

                        <p className="text-sm text-slate-400">
                          No members assigned to
                          this group yet.
                        </p>

                      </div>

                    )}

                  </div>

                </div>
              )
            })}

          </div>

        ) : (

          <div className="px-6 py-14 text-center">

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

      {/* ========================================================
          EDIT GROUP MODAL
      ======================================================== */}

      {editingGroup && (

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:px-4"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !isSaving
            ) {
              handleClose()
            }
          }}
        >

          <div className="w-full max-w-md rounded-t-2xl bg-white shadow-xl sm:rounded-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Accountability Group
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the group name and leader.
                </p>

              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleEditSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              {/* Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Group Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Group Name
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
                  disabled={isSaving}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 sm:text-sm"
                />

              </div>

              {/* Group Leader */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Group Leader
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
                  disabled={isSaving}
                  placeholder="Enter group leader name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 sm:text-sm"
                />

              </div>

              {/* Current Member Count */}

              <div className="rounded-lg bg-slate-50 px-4 py-3">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Current members
                  </span>

                  <span className="font-semibold text-slate-900">
                    {getMemberCount(
                      editingGroup.name
                    )}
                  </span>

                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleClose}
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

export default Accountability