import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Search,
  Plus,
  MoreVertical,
  Users,
  Phone,
  MapPin,
  Hash,
  X,
  Eye,
  Pencil,
  Trash2,
  Mail,
  BookOpen,
  UsersRound,
  Save,
} from 'lucide-react'
import { useMembers } from '../context/MemberContext'

function Students() {
  const navigate = useNavigate()

  const {
    members,
    updateMember,
    deleteMember,
    departments,
  } = useMembers()

  const students = useMemo(
    () => members.filter((member) => member.type === 'student'),
    [members]
  )

  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [openMenu, setOpenMenu] = useState(null)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [modalMode, setModalMode] = useState(null)

  const [editForm, setEditForm] = useState({})

  const years = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
  ]

  // Close the row menu when tapping/clicking anywhere outside it
  useEffect(() => {
    if (openMenu === null) return

    const handlePointerDown = (event) => {
      if (!event.target.closest('[data-row-menu]')) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () =>
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      )
  }, [openMenu])

  // Stop the page behind the modal from scrolling (important on phones)
  useEffect(() => {
    if (!selectedStudent) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [selectedStudent])

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return students.filter((student) => {
      const matchesYear =
        yearFilter === 'All' || student.year === yearFilter

      const searchableText = [
        student.name,
        student.firstName,
        student.middleName,
        student.lastName,
        student.email,
        student.course,
        student.admissionNumber,
        student.phone,
        student.alternativePhone,
        student.residence,
        student.location,
        student.address,
        student.group,
        student.accountabilityGroup,
        student.department,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      return matchesYear && matchesSearch
    })
  }, [students, search, yearFilter])

  const getInitials = (student) => {
    const first =
      student.firstName?.charAt(0) ||
      student.name?.charAt(0) ||
      ''

    const last =
      student.lastName?.charAt(0) ||
      student.name?.split(' ').slice(-1)[0]?.charAt(0) ||
      ''

    return `${first}${last}`.toUpperCase()
  }

  const getYearCount = (year) =>
    students.filter((student) => student.year === year).length

  const openView = (student) => {
    setSelectedStudent(student)
    setModalMode('view')
    setOpenMenu(null)
  }

  const openEdit = (student) => {
    setSelectedStudent(student)

    setEditForm({
      admissionNumber: student.admissionNumber || '',
      firstName:
        student.firstName ||
        student.name?.split(' ')[0] ||
        '',
      middleName: student.middleName || '',
      lastName:
        student.lastName ||
        student.name?.split(' ').slice(1).join(' ') ||
        '',
      gender: student.gender || '',
      phone: student.phone || '',
      alternativePhone: student.alternativePhone || '',
      email: student.email || '',
      residence: student.residence || '',
      location: student.location || '',
      address: student.address || '',
      year: student.year || '',
      course: student.course || '',
      department: student.department || '',
      accountabilityGroup:
        student.accountabilityGroup ||
        student.group ||
        '',
      status: student.status || 'Active',
    })

    setModalMode('edit')
    setOpenMenu(null)
  }

  const closeModal = () => {
    setSelectedStudent(null)
    setModalMode(null)
    setEditForm({})
  }

  const handleEditChange = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSaveEdit = (event) => {
    event.preventDefault()

    if (!selectedStudent) return

    if (
      !editForm.admissionNumber.trim() ||
      !editForm.firstName.trim() ||
      !editForm.lastName.trim() ||
      !editForm.gender ||
      !editForm.phone.trim() ||
      !editForm.residence.trim() ||
      !editForm.year ||
      !editForm.accountabilityGroup
    ) {
      alert(
        'Please complete all required student information.'
      )
      return
    }

    const fullName = [
      editForm.firstName.trim(),
      editForm.middleName.trim(),
      editForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(' ')

    const updatedStudent = {
      ...selectedStudent,

      admissionNumber:
        editForm.admissionNumber.trim(),

      firstName:
        editForm.firstName.trim(),

      middleName:
        editForm.middleName.trim(),

      lastName:
        editForm.lastName.trim(),

      name: fullName,

      gender: editForm.gender,

      phone: editForm.phone.trim(),

      alternativePhone:
        editForm.alternativePhone.trim(),

      email: editForm.email.trim(),

      residence:
        editForm.residence.trim(),

      location:
        editForm.location.trim(),

      address:
        editForm.address.trim(),

      year: editForm.year,

      course:
        editForm.course.trim(),

      department:
        editForm.department.trim(),

      group:
        editForm.accountabilityGroup,

      accountabilityGroup:
        editForm.accountabilityGroup,

      status:
        editForm.status,
    }

    updateMember(selectedStudent.id, updatedStudent)

    setSelectedStudent(updatedStudent)
    setModalMode('view')

    alert('Student updated successfully.')
  }

  const handleDelete = (student) => {
    setOpenMenu(null)

    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}? This action cannot be undone.`
    )

    if (!confirmed) return

    deleteMember(student.id)

    if (selectedStudent?.id === student.id) {
      closeModal()
    }
  }

  // text-base on phones stops iOS from zooming into inputs on focus
  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm'

  const labelClass =
    'mb-2 block text-sm font-medium text-gray-700'

  const yearButtonClass = (active) =>
    `shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition sm:py-2 ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`

  const menuProps = {
    onView: openView,
    onEdit: openEdit,
    onDelete: handleDelete,
    openMenu,
    setOpenMenu,
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:h-12 sm:w-12">
            <GraduationCap size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Students
            </h1>

            <p className="mt-0.5 text-sm text-gray-500 sm:mt-1">
              Manage student records, contacts and accountability.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/students/add')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {/* YEAR SUMMARY */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <button
          onClick={() => setYearFilter('All')}
          className={`col-span-2 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow sm:p-5 lg:col-span-1 ${
            yearFilter === 'All'
              ? 'border-blue-500 ring-2 ring-blue-100'
              : 'border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                All Students
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 sm:mt-2">
                {students.length}
              </p>
            </div>

            <Users className="text-blue-500" size={24} />
          </div>
        </button>

        {years.map((year) => (
          <button
            key={year}
            onClick={() => setYearFilter(year)}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow sm:p-5 ${
              yearFilter === year
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-gray-100'
            }`}
          >
            <p className="text-sm text-gray-500">
              {year}
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900 sm:mt-2">
              {getYearCount(year)}
            </p>
          </button>
        ))}
      </div>

      {/* SEARCH / FILTER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, admission no., phone..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-base outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:text-sm"
            />
          </div>

          {/* Scrolls sideways on small screens instead of wrapping into rows */}
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            <button
              onClick={() => setYearFilter('All')}
              className={yearButtonClass(
                yearFilter === 'All'
              )}
            >
              All
            </button>

            {years.map((year) => (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                className={yearButtonClass(
                  yearFilter === year
                )}
              >
                {year.replace(' Year', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EMPTY STATE (shared by card list and table) */}
      {filteredStudents.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users size={28} className="text-gray-400" />
            </div>

            <h3 className="font-semibold text-gray-900">
              No students found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or year filter.
            </p>
          </div>
        </div>
      )}

      {/* MOBILE + TABLET: CARD LIST */}
      {filteredStudents.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => openView(student)}
              className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {getInitials(student)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">
                    {student.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {student.gender || 'Gender not specified'}
                  </p>
                </div>

                <div
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <RowMenu
                    student={student}
                    {...menuProps}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {student.year || '—'}
                </span>

                <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  {student.accountabilityGroup ||
                    student.group ||
                    'Unassigned'}
                </span>

                <StatusBadge status={student.status} />
              </div>

              <dl className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Hash
                    size={15}
                    className="shrink-0 text-gray-400"
                  />
                  <dd className="font-medium text-gray-700">
                    {student.admissionNumber || '—'}
                  </dd>
                </div>

                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone
                      size={15}
                      className="shrink-0 text-gray-400"
                    />
                    <dd>
                      <a
                        href={`tel:${student.phone}`}
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        className="text-blue-600"
                      >
                        {student.phone}
                      </a>
                    </dd>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin
                    size={15}
                    className="shrink-0 text-gray-400"
                  />
                  <dd className="min-w-0 truncate">
                    {student.residence || '—'}
                  </dd>
                </div>

                {student.department && (
                  <div className="flex items-center gap-2">
                    <BookOpen
                      size={15}
                      className="shrink-0 text-gray-400"
                    />
                    <dd className="min-w-0 truncate">
                      {student.department}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}

      {/* DESKTOP: TABLE */}
      {filteredStudents.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {[
                    'Student',
                    'Admission No.',
                    'Year',
                    'Department',
                    'Contact',
                    'Residence',
                    'Accountability',
                    'Status',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 xl:px-6"
                    >
                      {heading}
                    </th>
                  ))}

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 xl:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* STUDENT */}
                    <td className="px-5 py-4 xl:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {getInitials(student)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {student.gender || 'Gender not specified'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ADMISSION */}
                    <td className="px-5 py-4 xl:px-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Hash size={15} className="text-gray-400" />
                        {student.admissionNumber || '—'}
                      </div>
                    </td>

                    {/* YEAR */}
                    <td className="px-5 py-4 xl:px-6">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {student.year || '—'}
                      </span>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-5 py-4 xl:px-6">
                      {student.department ? (
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {student.department}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-4 xl:px-6">
                      <div className="space-y-1">
                        {student.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone
                              size={14}
                              className="text-gray-400"
                            />
                            {student.phone}
                          </div>
                        )}

                        {student.email && (
                          <div className="max-w-[180px] truncate text-xs text-gray-400">
                            {student.email}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* RESIDENCE */}
                    <td className="px-5 py-4 xl:px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin
                          size={15}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="max-w-[150px] truncate">
                          {student.residence || '—'}
                        </span>
                      </div>
                    </td>

                    {/* ACCOUNTABILITY */}
                    <td className="px-5 py-4 xl:px-6">
                      <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                        {student.accountabilityGroup ||
                          student.group ||
                          'Unassigned'}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4 xl:px-6">
                      <StatusBadge status={student.status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4 text-right xl:px-6">
                      <RowMenu
                        student={student}
                        {...menuProps}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: bottom sheet on phones, centered dialog from sm up */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl">
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {getInitials(selectedStudent)}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">
                    {modalMode === 'edit'
                      ? 'Edit Student'
                      : 'Student Details'}
                  </h2>

                  <p className="truncate text-sm text-gray-500">
                    {selectedStudent.name}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close"
                className="shrink-0 rounded-lg p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* VIEW MODE */}
            {modalMode === 'view' && (
              <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
                <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                  <InfoItem
                    icon={<Hash size={17} />}
                    label="Admission Number"
                    value={selectedStudent.admissionNumber}
                  />

                  <InfoItem
                    icon={<GraduationCap size={17} />}
                    label="Year"
                    value={selectedStudent.year}
                  />

                  <InfoItem
                    icon={<UsersRound size={17} />}
                    label="Gender"
                    value={selectedStudent.gender}
                  />

                  <InfoItem
                    icon={<Phone size={17} />}
                    label="Phone"
                    value={selectedStudent.phone}
                  />

                  <InfoItem
                    icon={<Phone size={17} />}
                    label="Alternative Phone"
                    value={selectedStudent.alternativePhone}
                  />

                  <InfoItem
                    icon={<Mail size={17} />}
                    label="Email"
                    value={selectedStudent.email}
                  />

                  <InfoItem
                    icon={<MapPin size={17} />}
                    label="Residence"
                    value={selectedStudent.residence}
                  />

                  <InfoItem
                    icon={<MapPin size={17} />}
                    label="Location"
                    value={selectedStudent.location}
                  />

                  <InfoItem
                    icon={<BookOpen size={17} />}
                    label="Course"
                    value={selectedStudent.course}
                  />

                  <InfoItem
                    icon={<BookOpen size={17} />}
                    label="Department"
                    value={selectedStudent.department}
                  />

                  <InfoItem
                    icon={<UsersRound size={17} />}
                    label="Accountability Group"
                    value={
                      selectedStudent.accountabilityGroup ||
                      selectedStudent.group
                    }
                  />

                  <InfoItem
                    label="Status"
                    value={selectedStudent.status}
                  />
                </div>

                {selectedStudent.address && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 sm:mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Address
                    </p>

                    <p className="mt-2 break-words text-sm text-gray-700">
                      {selectedStudent.address}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() =>
                      openEdit(selectedStudent)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Pencil size={17} />
                    Edit Student
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(selectedStudent)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                    Delete Student
                  </button>
                </div>
              </div>
            )}

            {/* EDIT MODE */}
            {modalMode === 'edit' && (
              <form
                onSubmit={handleSaveEdit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-7 sm:space-y-8">
                    {/* PERSONAL INFORMATION */}
                    <section>
                      <div className="mb-4 sm:mb-5">
                        <h3 className="font-semibold text-gray-900">
                          Personal Information
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Update the student's basic information.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
                        <Field
                          label="First Name"
                          required
                          value={editForm.firstName}
                          onChange={(value) =>
                            handleEditChange(
                              'firstName',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Middle Name"
                          value={editForm.middleName}
                          onChange={(value) =>
                            handleEditChange(
                              'middleName',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Last Name"
                          required
                          value={editForm.lastName}
                          onChange={(value) =>
                            handleEditChange(
                              'lastName',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Gender *
                          </label>

                          <select
                            value={editForm.gender}
                            onChange={(event) =>
                              handleEditChange(
                                'gender',
                                event.target.value
                              )
                            }
                            className={inputClass}
                          >
                            <option value="">
                              Select gender
                            </option>

                            <option value="Male">
                              Male
                            </option>

                            <option value="Female">
                              Female
                            </option>
                          </select>
                        </div>

                        <Field
                          label="Admission Number"
                          required
                          value={editForm.admissionNumber}
                          onChange={(value) =>
                            handleEditChange(
                              'admissionNumber',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Status
                          </label>

                          <select
                            value={editForm.status}
                            onChange={(event) =>
                              handleEditChange(
                                'status',
                                event.target.value
                              )
                            }
                            className={inputClass}
                          >
                            <option value="Active">
                              Active
                            </option>

                            <option value="Inactive">
                              Inactive
                            </option>
                          </select>
                        </div>
                      </div>
                    </section>

                    {/* CONTACT */}
                    <section>
                      <div className="mb-4 sm:mb-5">
                        <h3 className="font-semibold text-gray-900">
                          Contact & Residence
                        </h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <Field
                          label="Primary Phone"
                          required
                          type="tel"
                          value={editForm.phone}
                          onChange={(value) =>
                            handleEditChange(
                              'phone',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Alternative Phone"
                          type="tel"
                          value={editForm.alternativePhone}
                          onChange={(value) =>
                            handleEditChange(
                              'alternativePhone',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Email"
                          type="email"
                          value={editForm.email}
                          onChange={(value) =>
                            handleEditChange(
                              'email',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Residence"
                          required
                          value={editForm.residence}
                          onChange={(value) =>
                            handleEditChange(
                              'residence',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Location"
                          value={editForm.location}
                          onChange={(value) =>
                            handleEditChange(
                              'location',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <Field
                          label="Address"
                          value={editForm.address}
                          onChange={(value) =>
                            handleEditChange(
                              'address',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />
                      </div>
                    </section>

                    {/* ACADEMIC */}
                    <section>
                      <div className="mb-4 sm:mb-5">
                        <h3 className="font-semibold text-gray-900">
                          Academic Information
                        </h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div>
                          <label className={labelClass}>
                            Year *
                          </label>

                          <select
                            value={editForm.year}
                            onChange={(event) =>
                              handleEditChange(
                                'year',
                                event.target.value
                              )
                            }
                            className={inputClass}
                          >
                            <option value="">
                              Select year
                            </option>

                            {years.map((year) => (
                              <option
                                key={year}
                                value={year}
                              >
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Field
                          label="Course"
                          value={editForm.course}
                          onChange={(value) =>
                            handleEditChange(
                              'course',
                              value
                            )
                          }
                          inputClass={inputClass}
                        />

                        <div>
                          <label className={labelClass}>
                            Department
                          </label>

                          <select
                            value={editForm.department}
                            onChange={(event) =>
                              handleEditChange(
                                'department',
                                event.target.value
                              )
                            }
                            className={inputClass}
                          >
                            <option value="">
                              Not assigned
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
                          <label className={labelClass}>
                            Accountability Group *
                          </label>

                          <input
                            type="text"
                            value={
                              editForm.accountabilityGroup
                            }
                            onChange={(event) =>
                              handleEditChange(
                                'accountabilityGroup',
                                event.target.value
                              )
                            }
                            className={inputClass}
                            placeholder="e.g. Group 1"
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* EDIT ACTIONS: always visible, pinned below the scrolling form */}
                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------
   SMALL REUSABLE COMPONENTS
------------------------------ */

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        (status || 'Active') === 'Active'
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {status || 'Active'}
    </span>
  )
}

function RowMenu({
  student,
  openMenu,
  setOpenMenu,
  onView,
  onEdit,
  onDelete,
}) {
  const isOpen = openMenu === student.id

  return (
    <div
      data-row-menu
      className="relative inline-block text-left"
    >
      <button
        onClick={() =>
          setOpenMenu(isOpen ? null : student.id)
        }
        aria-label={`Actions for ${student.name}`}
        aria-expanded={isOpen}
        className="rounded-lg p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:p-2"
      >
        <MoreVertical size={19} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-gray-100 bg-white p-2 text-left shadow-xl">
          <button
            onClick={() => onView(student)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50 lg:py-2.5"
          >
            <Eye size={16} />
            View Student
          </button>

          <button
            onClick={() => onEdit(student)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 lg:py-2.5"
          >
            <Pencil size={16} />
            Edit Student
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={() => onDelete(student)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 transition hover:bg-red-50 lg:py-2.5"
          >
            <Trash2 size={16} />
            Delete Student
          </button>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  required = false,
  value,
  onChange,
  inputClass,
  type = 'text',
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && ' *'}
      </label>

      <input
        type={type}
        value={value || ''}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={inputClass}
      />
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-medium text-gray-800">
        {value || 'Not provided'}
      </p>
    </div>
  )
}

export default Students