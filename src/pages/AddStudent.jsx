import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  GraduationCap,
  UserRound,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Mail,
  Hash,
  Save,
  X,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

const YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
]

const GENDERS = [
  'Male',
  'Female',
]

const STATUS_OPTIONS = [
  'Active',
  'Inactive',
  'Graduated',
]

const INITIAL_FORM = {
  admissionNumber: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  phone: '',
  alternativePhone: '',
  email: '',
  residence: '',
  location: '',
  address: '',
  year: '',
  course: '',
  department: '',
  accountabilityGroup: '',
  status: 'Active',
}

function AddStudent() {
  const navigate = useNavigate()

  const {
    members = [],
    addMember,
    groups = [],
  } = useMembers()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
      submit: '',
    }))
  }

  function validateForm() {
    const newErrors = {}

    const admissionNumber =
      form.admissionNumber.trim()

    if (!admissionNumber) {
      newErrors.admissionNumber =
        'Admission number is required.'
    }

    const duplicateAdmissionNumber =
      members.some((member) => {
        const existingAdmissionNumber =
          member.admissionNumber ||
          member.admission_number ||
          ''

        return (
          String(existingAdmissionNumber)
            .trim()
            .toLowerCase() ===
          admissionNumber.toLowerCase()
        )
      })

    if (
      admissionNumber &&
      duplicateAdmissionNumber
    ) {
      newErrors.admissionNumber =
        'This admission number is already registered.'
    }

    if (!form.firstName.trim()) {
      newErrors.firstName =
        'First name is required.'
    }

    if (!form.lastName.trim()) {
      newErrors.lastName =
        'Last name is required.'
    }

    if (!form.gender) {
      newErrors.gender =
        'Please select the student gender.'
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        'Phone number is required.'
    }

    if (!form.residence.trim()) {
      newErrors.residence =
        'Residence is required.'
    }

    if (!form.year) {
      newErrors.year =
        'Year of study is required.'
    }

    if (!form.accountabilityGroup) {
      newErrors.accountabilityGroup =
        'Accountability group is required.'
    }

    return newErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSaving) {
      return
    }

    setErrors({})

    const validationErrors =
      validateForm()

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors)
      return
    }

    setIsSaving(true)

    const student = {
      type: 'student',

      admissionNumber:
        form.admissionNumber.trim(),

      firstName:
        form.firstName.trim(),

      middleName:
        form.middleName.trim(),

      lastName:
        form.lastName.trim(),

      name: [
        form.firstName.trim(),
        form.middleName.trim(),
        form.lastName.trim(),
      ]
        .filter(Boolean)
        .join(' '),

      gender:
        form.gender,

      phone:
        form.phone.trim(),

      alternativePhone:
        form.alternativePhone.trim(),

      email:
        form.email.trim(),

      residence:
        form.residence.trim(),

      location:
        form.location.trim(),

      address:
        form.address.trim(),

      year:
        form.year,

      course:
        form.course.trim(),

      department:
        form.department.trim(),

      group:
        form.accountabilityGroup,

      accountabilityGroup:
        form.accountabilityGroup,

      status:
        form.status,
    }

    try {
      await addMember(student)

      setSuccess(true)

      setTimeout(() => {
        navigate('/students')
      }, 900)
    } catch (error) {
      console.error(
        'Failed to save student:',
        error
      )

      setErrors({
        submit:
          'The student could not be saved. Please check your Firebase connection and try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    if (isSaving) {
      return
    }

    navigate('/students')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Students
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={25} />
            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Add Student
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Register a student and assign their accountability group.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* SUCCESS */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
            <Save size={17} />
          </div>

          <div>

            <p className="font-semibold">
              Student added successfully.
            </p>

            <p className="mt-0.5 text-emerald-600">
              Returning to the students list...
            </p>

          </div>

        </div>
      )}

      {/* SUBMIT ERROR */}
      {errors.submit && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* PERSONAL INFORMATION */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserRound size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-800">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Basic information about the student.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">

            <FormField
              label="Admission Number"
              required
              error={errors.admissionNumber}
            >
              <div className="relative">

                <Hash
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="admissionNumber"
                  value={form.admissionNumber}
                  onChange={handleChange}
                  placeholder="e.g. CH/2026/001"
                  className={inputClass(
                    errors.admissionNumber,
                    true
                  )}
                />

              </div>
            </FormField>

            <FormField
              label="First Name"
              required
              error={errors.firstName}
            >
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={inputClass(
                  errors.firstName
                )}
              />
            </FormField>

            <FormField label="Middle Name">
              <input
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
                className={inputClass()}
              />
            </FormField>

            <FormField
              label="Last Name"
              required
              error={errors.lastName}
            >
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={inputClass(
                  errors.lastName
                )}
              />
            </FormField>

            <FormField
              label="Gender"
              required
              error={errors.gender}
            >
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass(
                  errors.gender
                )}
              >
                <option value="">
                  Select gender
                </option>

                {GENDERS.map((gender) => (
                  <option
                    key={gender}
                    value={gender}
                  >
                    {gender}
                  </option>
                ))}
              </select>
            </FormField>

          </div>

        </section>

        {/* CONTACT */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Phone size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-800">
                  Contact Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Contact details for accountability and communication.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">

            <FormField
              label="Primary Phone"
              required
              error={errors.phone}
            >
              <div className="relative">

                <Phone
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0712 345 678"
                  className={inputClass(
                    errors.phone,
                    true
                  )}
                />

              </div>
            </FormField>

            <FormField label="Alternative Phone">
              <input
                name="alternativePhone"
                type="tel"
                value={form.alternativePhone}
                onChange={handleChange}
                placeholder="Alternative contact number"
                className={inputClass()}
              />
            </FormField>

            <FormField label="Email Address">
              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className={inputClass(
                    false,
                    true
                  )}
                />

              </div>
            </FormField>

          </div>

        </section>

        {/* RESIDENCE */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <MapPin size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-800">
                  Residence Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Where the student currently lives.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <FormField
              label="Residence"
              required
              error={errors.residence}
            >
              <input
                name="residence"
                value={form.residence}
                onChange={handleChange}
                placeholder="e.g. Main Campus Hostel"
                className={inputClass(
                  errors.residence
                )}
              />
            </FormField>

            <FormField label="Town / Location">
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Eldoret"
                className={inputClass()}
              />
            </FormField>

            <div className="md:col-span-2">

              <FormField label="Physical Address">
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter physical address or additional residence details..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </FormField>

            </div>

          </div>

        </section>

        {/* ACADEMIC */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <BookOpen size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-800">
                  Academic Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Student's current academic classification.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">

            <FormField
              label="Year of Study"
              required
              error={errors.year}
            >
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className={inputClass(
                  errors.year
                )}
              >
                <option value="">
                  Select year
                </option>

                {YEARS.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Course">
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className={inputClass()}
              />
            </FormField>

            <FormField label="Department">
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Computing"
                className={inputClass()}
              />
            </FormField>

          </div>

        </section>

        {/* ACCOUNTABILITY */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Users size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-800">
                  Church Accountability
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Assign the student to one of the accountability groups.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <FormField
              label="Accountability Group"
              required
              error={errors.accountabilityGroup}
            >
              <select
                name="accountabilityGroup"
                value={form.accountabilityGroup}
                onChange={handleChange}
                className={inputClass(
                  errors.accountabilityGroup
                )}
              >
                <option value="">
                  Select accountability group
                </option>

                {groups.map((group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Student Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass()}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </FormField>

          </div>

          <div className="mx-6 mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

            <div className="flex items-start gap-3">

              <Users
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-sm font-medium text-blue-800">
                  Accountability is important
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-600">
                  Every active student should belong to one accountability
                  group so that church leaders can track participation,
                  communication and student welfare effectively.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving || success}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {isSaving
              ? 'Saving Student...'
              : success
                ? 'Student Saved'
                : 'Save Student'}
          </button>

        </div>

      </form>

    </div>
  )
}

function FormField({
  label,
  required = false,
  error,
  children,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  )
}

function inputClass(
  error,
  withIcon = false
) {
  return `w-full rounded-lg border ${
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
  } ${
    withIcon
      ? 'pl-10'
      : 'px-4'
  } py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2`
}

export default AddStudent