import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Users, Building2, ArrowLeft } from 'lucide-react'

import { useMembers } from '../context/MemberContext'

const TYPE_CONFIG = {
  member: { label: 'Member', icon: Users, fields: [], route: '/members' },
  student: { label: 'Student', icon: GraduationCap, fields: ['year', 'course'], route: '/students' },
  community: { label: 'Community Member', icon: Building2, fields: [], route: '/community' },
}

function AddPerson({ type = 'member' }) {
  const navigate = useNavigate()
  const { addMember } = useMembers()
  const config = TYPE_CONFIG[type]
  const Icon = config.icon

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: 'First Year',
    course: '',
    department: '',
    group: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addMember({ ...formData, type })
    alert(`${config.label} registered successfully!`)
    navigate(config.route)
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(config.route)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add {config.label}</h1>
          <p className="mt-1 text-slate-500">
            Register a new {config.label.toLowerCase()} church member.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-8">
        {/* Personal Information — always shown */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Icon size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Personal Information</h2>
              <p className="text-sm text-slate-500">
                Basic information about the {config.label.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Enter full name" required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter email address" required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="07XXXXXXXX" required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Student-only fields */}
        {config.fields.includes('year') && (
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-900">Student Information</h2>
              <p className="mt-1 text-sm text-slate-500">Academic information about the student.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Year of Study</label>
                <select
                  name="year" value={formData.year} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>First Year</option>
                  <option>Second Year</option>
                  <option>Third Year</option>
                  <option>Fourth Year</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Course</label>
                <input
                  type="text" name="course" value={formData.course} onChange={handleChange}
                  placeholder="e.g. Computer Science" required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Church Information — always shown */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-900">Church Information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Assign to a department and accountability group.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <select
                name="department" value={formData.department} onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select department</option>
                <option>Praise & Worship</option>
                <option>Media</option>
                <option>Hospitality</option>
                <option>Evangelism</option>
                <option>Intercession</option>
                <option>Ushering</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Accountability Group</label>
              <select
                name="group" value={formData.group} onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select group</option>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={`Group ${n}`}>Group {n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="button" onClick={() => navigate(config.route)}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register {config.label}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPerson