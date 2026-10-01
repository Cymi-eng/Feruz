import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Search,
  Plus,
  MoreVertical,
  Users,
  Phone,
  MapPin,
  BookOpen,
  UserRound,
  X,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

const YEARS = [
  'All Years',
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
]

const ACCOUNTABILITY_GROUPS = [
  'All Groups',
  'Group 1',
  'Group 2',
  'Group 3',
  'Group 4',
  'Group 5',
  'Group 6',
  'Group 7',
]

const STATUS_OPTIONS = [
  'All Status',
  'Active',
  'Inactive',
  'Graduated',
]

function Students() {
  const navigate = useNavigate()
  const { members } = useMembers()

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [selectedGroup, setSelectedGroup] = useState('All Groups')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)

  /*
   * Only student records are displayed here.
   *
   * The fallback fields allow the page to work with the existing
   * MemberContext while we transition the system to the new
   * church-student structure.
   */
  const students = useMemo(() => {
    return members
      .filter((member) => member.type === 'student')
      .map((student) => ({
        id: student.id,
        name: student.name || 'No name',
        admissionNumber:
          student.admissionNumber ||
          student.admission_number ||
          student.admissionNo ||
          '—',
        phone:
          student.phone ||
          student.phoneNumber ||
          student.contact ||
          '—',
        alternativePhone:
          student.alternativePhone ||
          student.alternative_phone ||
          '—',
        email: student.email || '—',
        residence:
          student.residence ||
          student.location ||
          student.address ||
          '—',
        year: student.year || '—',
        course: student.course || '—',
        department: student.department || '—',
        group:
          student.group ||
          student.accountability ||
          student.accountabilityGroup ||
          'Unassigned',
        status: student.status || 'Active',
        gender: student.gender || '—',
      }))
  }, [members])

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim()

    return students.filter((student) => {
      const searchableText = [
        student.name,
        student.admissionNumber,
        student.phone,
        student.email,
        student.residence,
        student.course,
        student.department,
        student.group,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      const matchesYear =
        selectedYear === 'All Years' ||
        student.year === selectedYear

      const matchesGroup =
        selectedGroup === 'All Groups' ||
        student.group === selectedGroup

      const matchesStatus =
        selectedStatus === 'All Status' ||
        student.status === selectedStatus

      return (
        matchesSearch &&
        matchesYear &&
        matchesGroup &&
        matchesStatus
      )
    })
  }, [
    students,
    search,
    selectedYear,
    selectedGroup,
    selectedStatus,
  ])

  const activeStudents = students.filter(
    (student) => student.status === 'Active'
  ).length

  const getYearCount = (year) => {
    return students.filter(
      (student) => student.year === year
    ).length
  }

  const getGroupCount = (group) => {
    return students.filter(
      (student) => student.group === group
    ).length
  }

  const getInitials = (name) => {
    if (!name || name === 'No name') return 'NA'

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedYear('All Years')
    setSelectedGroup('All Groups')
    setSelectedStatus('All Status')
  }

  const hasFilters =
    search ||
    selectedYear !== 'All Years' ||
    selectedGroup !== 'All Groups' ||
    selectedStatus !== 'All Status'

  return (
    <div className="space-y-6">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Church Students
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage students, contacts, residence and accountability.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => navigate('/students/add')}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Student
        </button>

      </div>


      {/* =========================================================
          SUMMARY CARDS
      ========================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* Total */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Students
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {students.length}
              </p>
            </div>

          </div>

        </div>


        {/* Active */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserRound size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Active Students
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {activeStudents}
              </p>
            </div>

          </div>

        </div>


        {/* First Year */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            First Year
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {getYearCount('First Year')}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Students
          </p>

        </div>


        {/* Second Year */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Second Year
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {getYearCount('Second Year')}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Students
          </p>

        </div>


        {/* Third + Fourth */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Third & Fourth Year
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {getYearCount('Third Year') +
              getYearCount('Fourth Year')}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Students
          </p>

        </div>

      </div>


      {/* =========================================================
          ACCOUNTABILITY GROUP SUMMARY
      ========================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-slate-800">
              Accountability Groups
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Student distribution across the seven accountability groups.
            </p>
          </div>

          <Users
            size={20}
            className="text-slate-400"
          />

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">

          {ACCOUNTABILITY_GROUPS.slice(1).map((group) => (

            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`rounded-lg border p-3 text-left transition ${
                selectedGroup === group
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >

              <p className="text-xs font-medium opacity-80">
                {group}
              </p>

              <p className="mt-1 text-xl font-bold">
                {getGroupCount(group)}
              </p>

              <p className="mt-0.5 text-[11px] opacity-70">
                students
              </p>

            </button>

          ))}

        </div>

      </div>


      {/* =========================================================
          SEARCH & FILTERS
      ========================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 xl:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission number, phone, course..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Year */}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}

          </select>


          {/* Group */}

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            {ACCOUNTABILITY_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}

          </select>


          {/* Status */}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}

          </select>


          {/* Clear */}

          {hasFilters && (

            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} />
              Clear
            </button>

          )}

        </div>

      </div>


      {/* =========================================================
          STUDENTS TABLE
      ========================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}

        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-semibold text-slate-800">
              {selectedYear === 'All Years'
                ? 'All Students'
                : selectedYear}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {filteredStudents.length}{' '}
              {filteredStudents.length === 1
                ? 'student'
                : 'students'}
              {selectedGroup !== 'All Groups'
                ? ` · ${selectedGroup}`
                : ''}
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Users size={17} />

            {filteredStudents.length}

          </div>

        </div>


        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admission No.
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Residence
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Year
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Accountability
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="w-12 px-4 py-4"></th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {filteredStudents.length > 0 ? (

                filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Student */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">

                          {getInitials(student.name)}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-medium text-slate-700">
                            {student.name}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {student.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Admission Number */}

                    <td className="px-6 py-4">

                      <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-xs font-medium text-slate-600">
                        {student.admissionNumber}
                      </span>

                    </td>


                    {/* Contact */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <Phone
                          size={15}
                          className="text-slate-400"
                        />

                        {student.phone}

                      </div>

                    </td>


                    {/* Residence */}

                    <td className="px-6 py-4">

                      <div className="flex max-w-[180px] items-center gap-2 text-sm text-slate-600">

                        <MapPin
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate">
                          {student.residence}
                        </span>

                      </div>

                    </td>


                    {/* Year */}

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                        <BookOpen size={13} />

                        {student.year}

                      </span>

                    </td>


                    {/* Accountability */}

                    <td className="px-6 py-4">

                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                        {student.group}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : student.status === 'Graduated'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.status}
                      </span>

                    </td>


                    {/* Actions */}

                    <td className="relative px-4 py-4">

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === student.id
                              ? null
                              : student.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >

                        <MoreVertical size={18} />

                      </button>


                      {openMenu === student.id && (

                        <div className="absolute right-4 top-14 z-30 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">

                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View Student
                          </button>

                          <button
                            onClick={() => {
                              navigate(
                                `/students/edit/${student.id}`
                              )
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Pencil size={16} />
                            Edit Student
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            onClick={() => {
                              setOpenMenu(null)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Remove Student
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <GraduationCap
                        size={28}
                        className="text-slate-400"
                      />
                    </div>

                    <p className="mt-4 font-medium text-slate-700">
                      No students found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or filters.
                    </p>

                    {hasFilters && (

                      <button
                        onClick={clearFilters}
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Clear all filters
                      </button>

                    )}

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================================================
          STUDENT DETAILS MODAL
      ========================================================== */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {getInitials(selectedStudent.name)}
                </div>

                <div>

                  <h2 className="font-semibold text-slate-800">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {selectedStudent.admissionNumber}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>


            {/* Modal Body */}

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Admission Number
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.admissionNumber}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Gender
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.gender}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone Number
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.phone}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Alternative Phone
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.alternativePhone}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all font-medium text-slate-700">
                  {selectedStudent.email}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Residence
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.residence}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Year of Study
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.year}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Course
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.course}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedStudent.department}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Accountability Group
                </p>

                <p className="mt-1 font-medium text-purple-700">
                  {selectedStudent.group}
                </p>
              </div>

            </div>


            {/* Modal Footer */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Students