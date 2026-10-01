import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

import { db } from '../firebase'

import { members as initialMembers } from '../data/members'

const MemberContext = createContext()

const MEMBERS_COLLECTION = 'members'
const DEPARTMENTS_COLLECTION = 'departments'
const GROUPS_COLLECTION = 'groups'


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

  const [members, setMembers] = useState([])

  const [departments, setDepartments] = useState([])

  const [groups, setGroups] =
    useState(initialGroups)

  const [loading, setLoading] =
    useState(true)


  /* ==========================================================
     LOAD FIRESTORE DATA
  ========================================================== */

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true)


        /* --------------------------------
           MEMBERS
        -------------------------------- */

        const membersSnapshot =
          await getDocs(
            collection(
              db,
              MEMBERS_COLLECTION
            )
          )

        const firestoreMembers =
          membersSnapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          )


        /*
         * Keep the existing sample data
         * available if Firestore is empty.
         */

        setMembers(
          firestoreMembers.length > 0
            ? firestoreMembers
            : initialMembers
        )


        /* --------------------------------
           DEPARTMENTS
        -------------------------------- */

        const departmentsSnapshot =
          await getDocs(
            collection(
              db,
              DEPARTMENTS_COLLECTION
            )
          )

        const firestoreDepartments =
          departmentsSnapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          )

        setDepartments(
          firestoreDepartments
        )


        /* --------------------------------
           GROUPS
        -------------------------------- */

        const groupsSnapshot =
          await getDocs(
            collection(
              db,
              GROUPS_COLLECTION
            )
          )

        const firestoreGroups =
          groupsSnapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          )


        if (
          firestoreGroups.length > 0
        ) {

          setGroups(
            firestoreGroups.map(
              (group) =>
                group.name
            )
          )

        } else {

          /*
           * Use the existing default groups
           * until groups are created.
           */

          setGroups(initialGroups)

        }

      } catch (error) {

        console.error(
          'Failed to load Firestore data:',
          error
        )

        /*
         * Keep the application usable
         * if Firebase is temporarily unavailable.
         */

        setMembers(initialMembers)

        setDepartments([])

        setGroups(initialGroups)

      } finally {

        setLoading(false)

      }

    }


    loadData()

  }, [])


  /* ==========================================================
     ADD MEMBER / STUDENT
  ========================================================== */

  const addMember = async (
    newMember
  ) => {

    const member = {

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

      updatedAt:
        new Date().toISOString(),

    }


    try {

      const document =
        await addDoc(
          collection(
            db,
            MEMBERS_COLLECTION
          ),
          member
        )


      const savedMember = {

        id: document.id,

        ...member,

      }


      setMembers(
        (currentMembers) => [
          ...currentMembers,
          savedMember,
        ]
      )


      console.log(
        'MEMBER CREATED:',
        savedMember
      )


      return savedMember

    } catch (error) {

      console.error(
        'Failed to create member:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     UPDATE MEMBER
  ========================================================== */

  const updateMember = async (
    memberId,
    updates
  ) => {

    try {

      const updatedMember = {

        ...updates,

        updatedAt:
          new Date().toISOString(),

      }


      await updateDoc(
        doc(
          db,
          MEMBERS_COLLECTION,
          memberId
        ),
        updatedMember
      )


      setMembers(
        (currentMembers) =>
          currentMembers.map(
            (member) =>
              member.id === memberId
                ? {
                    ...member,
                    ...updatedMember,
                  }
                : member
          )
      )

    } catch (error) {

      console.error(
        'Failed to update member:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     DELETE MEMBER
  ========================================================== */

  const deleteMember = async (
    memberId
  ) => {

    try {

      await deleteDoc(
        doc(
          db,
          MEMBERS_COLLECTION,
          memberId
        )
      )


      setMembers(
        (currentMembers) =>
          currentMembers.filter(
            (member) =>
              member.id !== memberId
          )
      )

    } catch (error) {

      console.error(
        'Failed to delete member:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     GET MEMBER
  ========================================================== */

  const getMember = (
    memberId
  ) => {

    return members.find(
      (member) =>
        member.id === memberId
    )

  }


  /* ==========================================================
     ADD DEPARTMENT
  ========================================================== */

  const addDepartment = async ({
    name,
    leader = '',
    assistant = '',
    roles = [],
  }) => {

    const cleanName =
      name?.trim()


    if (!cleanName) {
      return null
    }


    const alreadyExists =
      departments.some(
        (department) =>
          department.name
            ?.toLowerCase() ===
          cleanName.toLowerCase()
      )


    if (alreadyExists) {
      return null
    }


    const department = {

      name: cleanName,

      leader:
        leader?.trim() || '',

      assistant:
        assistant?.trim() || '',

      roles,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

    }


    try {

      const document =
        await addDoc(
          collection(
            db,
            DEPARTMENTS_COLLECTION
          ),
          department
        )


      const savedDepartment = {

        id: document.id,

        ...department,

      }


      setDepartments(
        (currentDepartments) => [
          ...currentDepartments,
          savedDepartment,
        ]
      )


      return savedDepartment

    } catch (error) {

      console.error(
        'Failed to create department:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     UPDATE DEPARTMENT
  ========================================================== */

  const updateDepartment = async (
    departmentId,
    updates
  ) => {

    const existingDepartment =
      departments.find(
        (department) =>
          department.id ===
          departmentId
      )


    if (!existingDepartment) {
      return
    }


    const updatedName =
      updates.name?.trim() ||
      existingDepartment.name


    const updatedDepartment = {

      ...updates,

      name: updatedName,

      leader:
        updates.leader !== undefined
          ? updates.leader.trim()
          : existingDepartment.leader,

      assistant:
        updates.assistant !== undefined
          ? updates.assistant.trim()
          : existingDepartment.assistant,

      roles:
        Array.isArray(updates.roles)
          ? updates.roles
          : existingDepartment.roles,

      updatedAt:
        new Date().toISOString(),

    }


    try {

      await updateDoc(
        doc(
          db,
          DEPARTMENTS_COLLECTION,
          departmentId
        ),
        updatedDepartment
      )


      setDepartments(
        (currentDepartments) =>
          currentDepartments.map(
            (department) =>
              department.id ===
              departmentId
                ? {
                    ...department,
                    ...updatedDepartment,
                  }
                : department
          )
      )


      /*
       * If department name changes,
       * update member assignments.
       */

      if (
        existingDepartment.name !==
        updatedName
      ) {

        const affectedMembers =
          members.filter(
            (member) =>
              member.department ===
              existingDepartment.name
          )


        for (
          const member
          of affectedMembers
        ) {

          await updateDoc(
            doc(
              db,
              MEMBERS_COLLECTION,
              member.id
            ),
            {
              department:
                updatedName,

              updatedAt:
                new Date().toISOString(),
            }
          )

        }


        setMembers(
          (currentMembers) =>
            currentMembers.map(
              (member) =>
                member.department ===
                existingDepartment.name
                  ? {
                      ...member,
                      department:
                        updatedName,
                    }
                  : member
            )
        )

      }

    } catch (error) {

      console.error(
        'Failed to update department:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     DELETE DEPARTMENT
  ========================================================== */

  const deleteDepartment = async (
    departmentId
  ) => {

    const departmentToDelete =
      departments.find(
        (department) =>
          department.id ===
          departmentId
      )


    if (!departmentToDelete) {
      return
    }


    try {

      await deleteDoc(
        doc(
          db,
          DEPARTMENTS_COLLECTION,
          departmentId
        )
      )


      setDepartments(
        (currentDepartments) =>
          currentDepartments.filter(
            (department) =>
              department.id !==
              departmentId
          )
      )


      /*
       * Keep members.
       * Remove department assignment.
       */

      const affectedMembers =
        members.filter(
          (member) =>
            member.department ===
            departmentToDelete.name
        )


      for (
        const member
        of affectedMembers
      ) {

        await updateDoc(
          doc(
            db,
            MEMBERS_COLLECTION,
            member.id
          ),
          {
            department: '',

            updatedAt:
              new Date().toISOString(),
          }
        )

      }


      setMembers(
        (currentMembers) =>
          currentMembers.map(
            (member) =>
              member.department ===
              departmentToDelete.name
                ? {
                    ...member,
                    department: '',
                  }
                : member
          )
      )

    } catch (error) {

      console.error(
        'Failed to delete department:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     ADD ACCOUNTABILITY GROUP
  ========================================================== */

  const addGroup = async (
    name
  ) => {

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


    try {

      await addDoc(
        collection(
          db,
          GROUPS_COLLECTION
        ),
        {
          name: cleanName,

          createdAt:
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString(),
        }
      )


      setGroups(
        (currentGroups) => [
          ...currentGroups,
          cleanName,
        ]
      )

    } catch (error) {

      console.error(
        'Failed to create group:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     UPDATE ACCOUNTABILITY GROUP
  ========================================================== */

  const updateGroup = async (
    oldName,
    newName
  ) => {

    const cleanName =
      newName?.trim()


    if (!cleanName) {
      return
    }


    try {

      const groupsSnapshot =
        await getDocs(
          collection(
            db,
            GROUPS_COLLECTION
          )
        )


      const groupDocument =
        groupsSnapshot.docs.find(
          (item) =>
            item.data().name ===
            oldName
        )


      if (groupDocument) {

        await updateDoc(
          doc(
            db,
            GROUPS_COLLECTION,
            groupDocument.id
          ),
          {
            name: cleanName,

            updatedAt:
              new Date().toISOString(),
          }
        )

      }


      setGroups(
        (currentGroups) =>
          currentGroups.map(
            (group) =>
              group === oldName
                ? cleanName
                : group
          )
      )


      /*
       * Synchronize member assignments.
       */

      const affectedMembers =
        members.filter(
          (member) =>
            member.group === oldName
        )


      for (
        const member
        of affectedMembers
      ) {

        await updateDoc(
          doc(
            db,
            MEMBERS_COLLECTION,
            member.id
          ),
          {
            group: cleanName,

            updatedAt:
              new Date().toISOString(),
          }
        )

      }


      setMembers(
        (currentMembers) =>
          currentMembers.map(
            (member) =>
              member.group === oldName
                ? {
                    ...member,
                    group: cleanName,
                  }
                : member
          )
      )

    } catch (error) {

      console.error(
        'Failed to update group:',
        error
      )

      throw error

    }

  }


  /* ==========================================================
     DELETE ACCOUNTABILITY GROUP
  ========================================================== */

  const deleteGroup = async (
    groupName
  ) => {

    try {

      const groupsSnapshot =
        await getDocs(
          collection(
            db,
            GROUPS_COLLECTION
          )
        )


      const groupDocument =
        groupsSnapshot.docs.find(
          (item) =>
            item.data().name ===
            groupName
        )


      if (groupDocument) {

        await deleteDoc(
          doc(
            db,
            GROUPS_COLLECTION,
            groupDocument.id
          )
        )

      }


      setGroups(
        (currentGroups) =>
          currentGroups.filter(
            (group) =>
              group !== groupName
          )
      )


      /*
       * Keep members.
       * Remove group assignment.
       */

      const affectedMembers =
        members.filter(
          (member) =>
            member.group === groupName
        )


      for (
        const member
        of affectedMembers
      ) {

        await updateDoc(
          doc(
            db,
            MEMBERS_COLLECTION,
            member.id
          ),
          {
            group: '',

            updatedAt:
              new Date().toISOString(),
          }
        )

      }


      setMembers(
        (currentMembers) =>
          currentMembers.map(
            (member) =>
              member.group === groupName
                ? {
                    ...member,
                    group: '',
                  }
                : member
          )
      )

    } catch (error) {

      console.error(
        'Failed to delete group:',
        error
      )

      throw error

    }

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


        /* Loading */

        loading,

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

  return useContext(
    MemberContext
  )

}