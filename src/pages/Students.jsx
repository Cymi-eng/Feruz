import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Search,
  Plus,
  MoreVertical,
  Users,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function Students() {
  const navigate = useNavigate()
  const { members } = useMembers()

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')

  const students = members.filter(
    (member) => member.type === 'student'
  )

  const years = [
    'All',
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
  ]

  const filteredStudents = students.filter((student) => {
    const name = student.name || ''
    const email = student.email || ''
    const course = student.course || ''

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase())

    const matchesYear =
      selectedYear === 'All' ||
      student.year === selectedYear

    return matchesSearch && matchesYear
  })

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap size={25} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Students
            </h1>

          </div>

          <p className="mt-2 text-slate-500">
            Manage church students from first year to fourth year.
          </p>
        </div>

        <button
          onClick={() => navigate('/students/add')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >

          <Plus size={18} />

          Add Student

        </button>

      </div>


      {/* Year Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {years.map((year) => {

          const count =
            year === 'All'
              ? students.length
              : students.filter(
                  (student) => student.year === year
                ).length

          return (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`text-left p-5 rounded-xl border transition ${
                selectedYear === year
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >

              <p className="text-sm opacity-80">
                {year}
              </p>

              <p className="mt-2 text-2xl font-bold">
                {count}
              </p>

              <p className="mt-1 text-xs opacity-70">
                students
              </p>

            </button>
          )
        })}

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
            placeholder="Search students by name, email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />

        </div>

      </div>


      {/* Student Table */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b border-slate-200">

          <div>

            <h2 className="font-semibold text-slate-800">
              {selectedYear === 'All'
                ? 'All Students'
                : selectedYear}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {filteredStudents.length} student
              {filteredStudents.length !== 1 ? 's' : ''}
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Users size={17} />

            {filteredStudents.length}

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Student
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Year
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Course
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

              {filteredStudents.length > 0 ? (

                filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Student */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-semibold">

                          {(student.name || 'NA')
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)}

                        </div>

                        <div>

                          <p className="font-medium text-slate-700">
                            {student.name || 'No name'}
                          </p>

                          <p className="text-xs text-slate-400">
                            {student.email || 'No email'}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Year */}

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {student.year || '—'}
                      </span>

                    </td>


                    {/* Course */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.course || '—'}
                    </td>


                    {/* Department */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.department || '—'}
                    </td>


                    {/* Group */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.group || '—'}
                    </td>


                    {/* Status */}

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700">
                        {student.status || 'Active'}
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
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >

                    <GraduationCap
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-medium text-slate-600">
                      No students found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or year filter.
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

export default Students