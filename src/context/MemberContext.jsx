
import { createContext, useContext, useState, useEffect } from 'react'
import { members as initialMembers } from '../data/members'

const MemberContext = createContext()

const DEPARTMENTS_STORAGE_KEY = 'church-departments'

const loadDepartments = () => {
  try {
    const saved = localStorage.getItem(DEPARTMENTS_STORAGE_KEY)

    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const initialGroups = [
  'Group 1',
  'Group 2',
  'Group 3',
  'Group 4',
  'Group 5',
  'Group 7',

]

export function MemberProvider({ children }) {

  const [members, setMembers] = useState(initialMembers)

  const [departments, setDepartments] = useState(loadDepartments)

  const [groups, setGroups] = useState(initialGroups)


  // Save departments to localStorage
  useEffect(() => {
    localStorage.setItem(
      DEPARTMENTS_STORAGE_KEY,
      JSON.stringify(departments)
    )
  }, [departments])


  // Add Member
  const addMember = (newMember) => {

    console.log('FORM DATA:', newMember)

    const member = {
      id: Date.now(),

      name: newMember.name,

      email: newMember.email,

      phone: newMember.phone,

      type: newMember.type,

      year:
        newMember.type === 'student'
          ? newMember.year
          : null,

      course:
        newMember.type === 'student'
          ? newMember.course
          : null,

      department: newMember.department,

      group: newMember.group,

      status: 'Active',
    }

    console.log('MEMBER CREATED:', member)

    setMembers((currentMembers) => {

      const updatedMembers = [
        ...currentMembers,
        member,
      ]

      console.log('ALL MEMBERS:', updatedMembers)

      return updatedMembers
    })
  }


  // Add Department
  const addDepartment = ({
    name,
    leader = '',
    assistant = '',
    roles = [],
  }) => {

    setDepartments((currentDepartments) => [
      ...currentDepartments,

      {
        id: Date.now(),
        name,
        leader,
        assistant,
        roles,
      },
    ])
  }


  // Add Accountability Group
  const addGroup = (name) => {

    setGroups((currentGroups) => [
      ...currentGroups,
      name,
    ])
  }


  return (
    <MemberContext.Provider
      value={{
        members,

        addMember,

        departments,

        addDepartment,

        groups,

        addGroup,
      }}
    >
      {children}
    </MemberContext.Provider>
  )
}


export function useMembers() {
  return useContext(MemberContext)
}
  