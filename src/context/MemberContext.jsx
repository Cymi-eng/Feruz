import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { members as initialMembers } from '../data/members'

const MemberContext = createContext()

const MEMBERS_STORAGE_KEY = 'church-members'
const DEPARTMENTS_STORAGE_KEY = 'church-departments'
const GROUPS_STORAGE_KEY = 'church-accountability-groups'


/* ============================================================
   LOCAL STORAGE HELPERS
============================================================ */

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)

    return saved
      ? JSON.parse(saved)
      : fallback
  } catch {
    return fallback
  }
}


/* ============================================================
   DEFAULT ACCOUNTABILITY GROUPS
============================================================ */

const initialGroups = [
  'Group 1',
  'Group 2',
  'Group 3',
  'Group 4',
  'Group 5',
  'Group 6',
  'Group 7',
]


/* ============================================================
   PROVIDER
============================================================ */

export function MemberProvider({ children }) {

  const [members, setMembers] = useState(() =>
    loadFromStorage(
      MEMBERS_STORAGE_KEY,
      initialMembers
    )
  )

  const [departments, setDepartments] = useState(() =>
    loadFromStorage(
      DEPARTMENTS_STORAGE_KEY,
      []
    )
  )

  const [groups, setGroups] = useState(() =>
    loadFromStorage(
      GROUPS_STORAGE_KEY,
      initialGroups
    )
  )


  /* ==========================================================
     SAVE MEMBERS
  ========================================================== */

  useEffect(() => {

    localStorage.setItem(
      MEMBERS_STORAGE_KEY,
      JSON.stringify(members)
    )

  }, [members])


  /* ==========================================================
     SAVE DEPARTMENTS
  ========================================================== */

  useEffect(() => {

    localStorage.setItem(
      DEPARTMENTS_STORAGE_KEY,
      JSON.stringify(departments)
    )

  }, [departments])


  /* ==========================================================
     SAVE ACCOUNTABILITY GROUPS
  ========================================================== */

  useEffect(() => {

    localStorage.setItem(
      GROUPS_STORAGE_KEY,
      JSON.stringify(groups)
    )

  }, [groups])


  /* ==========================================================
     ADD MEMBER / STUDENT
  ========================================================== */

  const addMember = (newMember) => {

    const member = {
      id: Date.now(),

      /* --------------------------------
         Basic identity
      -------------------------------- */

      name:
        newMember.name ||
        [
          newMember.firstName,
          newMember.middleName,
          newMember.lastName,
        ]
          .filter(Boolean)
          .join(' ')
          .trim(),

      firstName:
        newMember.firstName || '',

      middleName:
        newMember.middleName || '',

      lastName:
        newMember.lastName || '',

      gender:
        newMember.gender || '',


      /* --------------------------------
         Identification
      -------------------------------- */

      admissionNumber:
        newMember.admissionNumber ||
        newMember.admission_number ||
        '',


      /* --------------------------------
         Contact information
      -------------------------------- */

      email:
        newMember.email || '',

      phone:
        newMember.phone ||
        newMember.phoneNumber ||
        '',

      alternativePhone:
        newMember.alternativePhone ||
        newMember.alternative_phone ||
        '',


      /* --------------------------------
         Residence
      -------------------------------- */

      residence:
        newMember.residence || '',

      location:
        newMember.location || '',

      address:
        newMember.address || '',


      /* --------------------------------
         Member classification
      -------------------------------- */

      type:
        newMember.type || 'student',


      /* --------------------------------
         Academic information
      -------------------------------- */

      year:
        newMember.type === 'student'
          ? newMember.year || ''
          : null,

      course:
        newMember.type === 'student'
          ? newMember.course || ''
          : null,

      department:
        newMember.department || '',


      /* --------------------------------
         Accountability
      -------------------------------- */

      group:
        newMember.group ||
        newMember.accountabilityGroup ||
        '',


      /* --------------------------------
         Status
      -------------------------------- */

      status:
        newMember.status || 'Active',


      /* --------------------------------
         Created date
      -------------------------------- */

      createdAt:
        new Date().toISOString(),
    }


    console.log(
      'MEMBER CREATED:',
      member
    )


    setMembers((currentMembers) => {

      const updatedMembers = [
        ...currentMembers,
        member,
      ]

      console.log(
        'ALL MEMBERS:',
        updatedMembers
      )

      return updatedMembers
    })


    return member
  }


  /* ==========================================================
     UPDATE MEMBER
  ========================================================== */

  const updateMember = (memberId, updates) => {

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              ...updates,
              updatedAt:
                new Date().toISOString(),
            }
          : member
      )
    )
  }


  /* ==========================================================
     DELETE MEMBER
  ========================================================== */

  const deleteMember = (memberId) => {

    setMembers((currentMembers) =>
      currentMembers.filter(
        (member) => member.id !== memberId
      )
    )
  }


  /* ==========================================================
     GET MEMBER
  ========================================================== */

  const getMember = (memberId) => {

    return members.find(
      (member) => member.id === memberId
    )
  }


  /* ==========================================================
     ADD DEPARTMENT
  ========================================================== */

  const addDepartment = ({
    name,
    leader = '',
    assistant = '',
    roles = [],
  }) => {

    const department = {
      id: Date.now(),
      name,
      leader,
      assistant,
      roles,
      createdAt:
        new Date().toISOString(),
    }

    setDepartments((currentDepartments) => [
      ...currentDepartments,
      department,
    ])

    return department
  }


  /* ==========================================================
     UPDATE DEPARTMENT
  ========================================================== */

  const updateDepartment = (
    departmentId,
    updates
  ) => {

    setDepartments((currentDepartments) =>
      currentDepartments.map(
        (department) =>
          department.id === departmentId
            ? {
                ...department,
                ...updates,
              }
            : department
      )
    )
  }


  /* ==========================================================
     DELETE DEPARTMENT
  ========================================================== */

  const deleteDepartment = (
    departmentId
  ) => {

    setDepartments((currentDepartments) =>
      currentDepartments.filter(
        (department) =>
          department.id !== departmentId
      )
    )
  }


  /* ==========================================================
     ADD ACCOUNTABILITY GROUP
  ========================================================== */

  const addGroup = (name) => {

    const cleanName =
      name?.trim()

    if (!cleanName) {
      return
    }

    const alreadyExists =
      groups.some(
        (group) =>
          group.toLowerCase() ===
          cleanName.toLowerCase()
      )

    if (alreadyExists) {
      return
    }

    setGroups((currentGroups) => [
      ...currentGroups,
      cleanName,
    ])
  }


  /* ==========================================================
     UPDATE ACCOUNTABILITY GROUP
  ========================================================== */

  const updateGroup = (
    oldName,
    newName
  ) => {

    const cleanName =
      newName?.trim()

    if (!cleanName) {
      return
    }

    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group === oldName
          ? cleanName
          : group
      )
    )


    /*
     * Keep existing student assignments
     * synchronized with the renamed group.
     */

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.group === oldName
          ? {
              ...member,
              group: cleanName,
            }
          : member
      )
    )
  }


  /* ==========================================================
     DELETE ACCOUNTABILITY GROUP
  ========================================================== */

  const deleteGroup = (groupName) => {

    setGroups((currentGroups) =>
      currentGroups.filter(
        (group) =>
          group !== groupName
      )
    )


    /*
     * Do not delete students when a group
     * is removed. Simply unassign them.
     */

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.group === groupName
          ? {
              ...member,
              group: '',
            }
          : member
      )
    )
  }


  /* ==========================================================
     PROVIDER
  ========================================================== */

  return (
    <MemberContext.Provider
      value={{
        /* Members */

        members,
        addMember,
        updateMember,
        deleteMember,
        getMember,

        /* Departments */

        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,

        /* Accountability */

        groups,
        addGroup,
        updateGroup,
        deleteGroup,
      }}
    >
      {children}
    </MemberContext.Provider>
  )
}


/* ============================================================
   HOOK
============================================================ */

export function useMembers() {
  return useContext(MemberContext)
}