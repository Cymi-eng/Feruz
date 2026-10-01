import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserRound, Save, CheckCircle } from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function AddCommunity() {
  const navigate = useNavigate()

  const {
    addMember,
    departments = [],
    groups = [],
  } = useMembers()

  const [formData, setFormData] = useState({
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
    department: '',
    group: '',
    status: 'Active',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSaving) return

    setError('')
    setSuccess(false)

    const firstName = formData.firstName.trim()
    const middleName = formData.middleName.trim()
    const lastName = formData.lastName.trim()
    const phone = formData.phone.trim()

    if (!firstName || !lastName || !phone) {
      setError(
        'Please provide the first name, last name, and phone number.'
      )
      return
    }

    const fullName = [
      firstName,
      middleName,
      lastName,
    ]
      .filter(Boolean)
      .join(' ')

    const communityMember = {
      type: 'community',

      name: fullName,

      firstName,
      middleName,
      lastName,

      gender: formData.gender,

      email: formData.email.trim(),

      phone,

      alternativePhone:
        formData.alternativePhone.trim(),

      residence:
        formData.residence.trim(),

      location:
        formData.location.trim(),

      address:
        formData.address.trim(),

      department:
        formData.department,

      group:
        formData.group,

      accountabilityGroup:
        formData.group,

      status:
        formData.status,
    }

    setIsSaving(true)

    try {
      await addMember(communityMember)

      setSuccess(true)

      setTimeout(() => {
        navigate('/community')
      }, 900)
    } catch (err) {
      console.error(
        'Failed to save community member:',
        err
      )

      setError(
        'The community member could not be saved. Please check your Firebase connection and try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={() => navigate('/community')}
          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
        >
          <ArrowLeft
            size={20}
            className="text-slate-600"
          />
        </button>

        <div>
          <div className="flex items-center gap-3">

            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <UserRound size={24} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Add Community Member
            </h1>

          </div>

          <p className="mt-2 text-slate-500">
            Register a new member of the church community.
          </p>
        </div>

      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
          <CheckCircle size={20} />

          <span>
            Community member saved successfully. Redirecting...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      >

        {/* Personal Information */}
        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Enter the member's basic information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Middle Name
              </label>

              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name *
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

          </div>

        </div>

        {/* Contact Information */}
        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Contact Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add the member's contact details.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="0712 345 678"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alternative Phone
              </label>

              <input
                type="tel"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="member@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Residence
              </label>

              <input
                type="text"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
                placeholder="e.g. Eldoret Town"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kapsoya"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Physical address"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

        </div>

        {/* Church Information */}
        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Church Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Assign the member to the appropriate church structures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Accountability Group
              </label>

              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select group
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 bg-slate-50">

          <button
            type="button"
            onClick={() => navigate('/community')}
            disabled={isSaving}
            className="px-5 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving || success}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {success ? (
              <>
                <CheckCircle size={18} />
                Saved
              </>
            ) : (
              <>
                <Save size={18} />
                {isSaving
                  ? 'Saving...'
                  : 'Save Community Member'}
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  )
}

export default AddCommunity