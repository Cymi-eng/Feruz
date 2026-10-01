import {
  Users,
  GraduationCap,
  UserRound,
  Building2,
  UsersRound,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
} from 'lucide-react'

import { useMembers } from '../context/MemberContext'

function Dashboard() {
  const {
    members = [],
    departments = [],
  } = useMembers()

  // -----------------------------------------
  // REAL MEMBER DATA
  // -----------------------------------------

  const students = members.filter(
    (member) => member.type === 'student'
  )

  const communityMembers = members.filter(
    (member) => member.type === 'community'
  )

  const totalMembers = members.length

  const activeMembers = members.filter(
    (member) => member.status === 'Active'
  ).length

  const servingMembers = members.filter(
    (member) => member.department
  ).length

  // -----------------------------------------
  // STUDENTS BY YEAR
  // -----------------------------------------

  const yearNames = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
  ]

  const studentYears = yearNames.map((year) => ({
    year,
    count: students.filter(
      (student) => student.year === year
    ).length,
  }))

  const highestStudentCount = Math.max(
    ...studentYears.map((item) => item.count),
    1
  )

  // -----------------------------------------
  // DEPARTMENT DATA
  // -----------------------------------------

  const departmentStats = departments.map((department) => {
    const departmentMembers = members.filter(
      (member) => member.department === department.name
    )

    return {
      ...department,
      members: departmentMembers.length,
    }
  })

  // -----------------------------------------
  // MEMBER PERCENTAGES
  // -----------------------------------------

  const studentPercentage =
    totalMembers > 0
      ? Math.round((students.length / totalMembers) * 100)
      : 0

  const communityPercentage =
    totalMembers > 0
      ? Math.round(
          (communityMembers.length / totalMembers) * 100
        )
      : 0

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      description: `${activeMembers} active members`,
      icon: Users,
    },
    {
      title: 'Students',
      value: students.length,
      description: `${studentPercentage}% of members`,
      icon: GraduationCap,
    },
    {
      title: 'Community Members',
      value: communityMembers.length,
      description: `${communityPercentage}% of members`,
      icon: UserRound,
    },
    {
      title: 'Departments',
      value: departments.length,
      description: `${servingMembers} members serving`,
      icon: Building2,
    },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Welcome back, Admin. Here's what's happening in the church.
          </p>
        </div>

        <div className="flex items-center gap-4">

          {/* Search */}

          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-32 outline-none text-sm"
            />
          </div>

          {/* Notifications */}

          <button
            type="button"
            className="relative p-2 bg-white border border-slate-200 rounded-lg"
          >
            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">

            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded-full font-semibold">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                Super Admin
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-400"
            />

          </div>

        </div>

      </div>


      {/* Statistics */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Icon size={24} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-sm text-slate-500">
                <TrendingUp
                  size={16}
                  className="text-blue-600"
                />

                <span>
                  {stat.description}
                </span>
              </div>

            </div>
          )
        })}

      </div>


      {/* Student Overview + Member Overview */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Student Years */}

        <div className="bg-white rounded-xl border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Students by Year
              </h2>

              <p className="text-sm text-slate-400">
                Current student distribution
              </p>
            </div>

            <GraduationCap className="text-blue-600" />

          </div>

          <div className="space-y-5">

            {studentYears.map((student) => {

              const percentage =
                highestStudentCount > 0
                  ? (student.count / highestStudentCount) * 100
                  : 0

              return (
                <div key={student.year}>

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-medium text-slate-600">
                      {student.year}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {student.count}
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full">

                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              )
            })}

          </div>

          {students.length === 0 && (
            <div className="mt-6 py-8 text-center border border-dashed border-slate-200 rounded-lg">
              <GraduationCap
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-2 text-sm text-slate-500">
                No student records available yet.
              </p>
            </div>
          )}

        </div>


        {/* Member Breakdown */}

        <div className="bg-white rounded-xl border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Member Overview
              </h2>

              <p className="text-sm text-slate-400">
                Church membership breakdown
              </p>
            </div>

            <UsersRound className="text-blue-600" />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-5 bg-blue-50 rounded-xl">
              <p className="text-sm text-slate-500">
                Students
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {students.length}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">
                Community
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {communityMembers.length}
              </p>
            </div>

          </div>

          {/* Students */}

          <div className="mt-6">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-slate-500">
                Students
              </span>

              <span className="font-medium">
                {studentPercentage}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full">

              <div
                className="h-3 bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${studentPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Community */}

          <div className="mt-4">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-slate-500">
                Community
              </span>

              <span className="font-medium">
                {communityPercentage}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full">

              <div
                className="h-3 bg-slate-400 rounded-full transition-all"
                style={{
                  width: `${communityPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* Departments */}

      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Departments
            </h2>

            <p className="text-sm text-slate-400">
              People currently serving
            </p>
          </div>

          <Building2 className="text-blue-600" />

        </div>

        {departmentStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

            {departmentStats.map((department) => (

              <div
                key={department.id || department.name}
                className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition"
              >

                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={20} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-700">
                  {department.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {department.members}{' '}
                  {department.members === 1
                    ? 'member'
                    : 'members'}
                </p>

              </div>

            ))}

          </div>
        ) : (
          <div className="py-10 text-center border border-dashed border-slate-200 rounded-xl">

            <Building2
              size={36}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-600">
              No departments yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Create departments to see them here.
            </p>

          </div>
        )}

      </div>

    </div>
  )
}

export default Dashboard