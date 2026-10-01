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
    <div className="space-y-5 sm:space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Welcome back, Admin. Here's what's happening in the church.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">

          {/* Search: fills the row on phones, fixed width from md up */}

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 md:flex-none md:py-2">
            <Search
              size={18}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full min-w-0 text-base outline-none sm:text-sm md:w-32"
            />
          </div>

          {/* Notifications */}

          <button
            type="button"
            aria-label="Notifications"
            className="relative shrink-0 rounded-lg border border-slate-200 bg-white p-2.5 md:p-2"
          >
            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 md:right-1 md:top-1" />
          </button>

          {/* Profile */}

          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
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
              className="hidden text-slate-400 sm:block"
            />

          </div>

        </div>

      </div>


      {/* Statistics */}

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
            >

              <div className="flex items-start justify-between gap-2">

                <div className="min-w-0">
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:mt-2 sm:text-3xl">
                    {stat.value}
                  </h2>
                </div>

                <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 sm:p-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

              </div>

              <div className="mt-3 flex items-start gap-1 text-xs text-slate-500 sm:mt-4 sm:items-center sm:text-sm">
                <TrendingUp
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-600 sm:mt-0"
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

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">

        {/* Student Years */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">

          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Students by Year
              </h2>

              <p className="text-sm text-slate-400">
                Current student distribution
              </p>
            </div>

            <GraduationCap className="shrink-0 text-blue-600" />

          </div>

          <div className="space-y-4 sm:space-y-5">

            {studentYears.map((student) => {

              const percentage =
                highestStudentCount > 0
                  ? (student.count / highestStudentCount) * 100
                  : 0

              return (
                <div key={student.year}>

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm font-medium text-slate-600">
                      {student.year}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {student.count}
                    </span>

                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100">

                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
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
            <div className="mt-6 rounded-lg border border-dashed border-slate-200 py-8 text-center">
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

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">

          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Member Overview
              </h2>

              <p className="text-sm text-slate-400">
                Church membership breakdown
              </p>
            </div>

            <UsersRound className="shrink-0 text-blue-600" />

          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            <div className="rounded-xl bg-blue-50 p-4 sm:p-5">
              <p className="text-sm text-slate-500">
                Students
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {students.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
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

            <div className="mb-2 flex justify-between text-sm">

              <span className="text-slate-500">
                Students
              </span>

              <span className="font-medium">
                {studentPercentage}%
              </span>

            </div>

            <div className="h-3 w-full rounded-full bg-slate-100">

              <div
                className="h-3 rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${studentPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Community */}

          <div className="mt-4">

            <div className="mb-2 flex justify-between text-sm">

              <span className="text-slate-500">
                Community
              </span>

              <span className="font-medium">
                {communityPercentage}%
              </span>

            </div>

            <div className="h-3 w-full rounded-full bg-slate-100">

              <div
                className="h-3 rounded-full bg-slate-400 transition-all"
                style={{
                  width: `${communityPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* Departments */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">

        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Departments
            </h2>

            <p className="text-sm text-slate-400">
              People currently serving
            </p>
          </div>

          <Building2 className="shrink-0 text-blue-600" />

        </div>

        {departmentStats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">

            {departmentStats.map((department) => (

              <div
                key={department.id || department.name}
                className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 sm:p-4"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users size={20} />
                </div>

                <h3 className="mt-3 break-words font-semibold text-slate-700 sm:mt-4">
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
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">

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