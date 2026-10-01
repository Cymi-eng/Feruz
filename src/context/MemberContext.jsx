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
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../firebase'

import { members as initialMembers } from '../data/members'

const MemberContext = createContext()

const MEMBERS_COLLECTION = 'members'
const DEPARTMENTS_COLLECTION = 'departments'
const GROUPS_COLLECTION = 'groups'

/* ============================================================
   PROVIDER
============================================================ */

export function MemberProvider({ children }) {
  const [members, setMembers] = useState([])
  const [departments, setDepartments] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  /* ==========================================================
     LOAD + LISTEN TO FIRESTORE DATA
  ========================================================== */

  useEffect(() => {
    let unsubscribeDepartments = null
    let unsubscribeMembers = null
    let unsubscribeGroups = null

    const initializeDepartmentsFromMembers = async (
      loadedMembers
    ) => {
      const memberDepartmentNames = [
        ...new Set(
          loadedMembers
            .map((member) => member.department?.trim())
            .filter(Boolean)
        ),
      ]

      if (memberDepartmentNames.length === 0) {
        return
      }

      try {
        const departmentSnapshot = await getDocs(
          collection(
            db,
            DEPARTMENTS_COLLECTION
          )
        )

        const existingNames = new Set(
          departmentSnapshot.docs
            .map(
              (item) =>
                item.data().name?.trim().toLowerCase()
            )
            .filter(Boolean)
        )

        for (const departmentName of memberDepartmentNames) {
          if (
            !existingNames.has(
              departmentName.toLowerCase()
            )
          ) {
            await addDoc(
              collection(
                db,
                DEPARTMENTS_COLLECTION
              ),
              {
                name: departmentName,
                leader: '',
                assistant: '',
                roles: [],
                createdAt:
                  new Date().toISOString(),
                updatedAt:
                  new Date().toISOString(),
              }
            )

            existingNames.add(
              departmentName.toLowerCase()
            )
          }
        }
      } catch (error) {
        console.error(
          'Failed to initialize departments from members:',
          error
        )
      }
    }

    const loadData = async () => {
      try {
        setLoading(true)

        /* --------------------------------
           MEMBERS
        -------------------------------- */

        unsubscribeMembers = onSnapshot(
          collection(
            db,
            MEMBERS_COLLECTION
          ),
          (snapshot) => {
            const firestoreMembers =
              snapshot.docs.map(
                (item) => ({
                  id: item.id,
                  ...item.data(),
                })
              )

            const loadedMembers =
              firestoreMembers.length > 0
                ? firestoreMembers
                : initialMembers

            setMembers(loadedMembers)

            /*
             * Existing members may already have
             * department assignments.
             *
             * Make sure those departments also
             * exist in the departments collection.
             */
            initializeDepartmentsFromMembers(
              loadedMembers
            )
          },
          (error) => {
            console.error(
              'Failed to listen to members:',
              error
            )

            setMembers(initialMembers)

            initializeDepartmentsFromMembers(
              initialMembers
            )
          }
        )

        /* --------------------------------
           DEPARTMENTS
        -------------------------------- */

        unsubscribeDepartments = onSnapshot(
          collection(
            db,
            DEPARTMENTS_COLLECTION
          ),
          (snapshot) => {
            const firestoreDepartments =
              snapshot.docs
                .map(
                  (item) => ({
                    id: item.id,
                    ...item.data(),
                  })
                )
                .filter(
                  (department) =>
                    department.name &&
                    typeof department.name ===
                      'string'
                )
                .map(
                  (department) => ({
                    id: department.id,

                    name:
                      department.name.trim(),

                    leader:
                      department.leader ||
                      '',

                    assistant:
                      department.assistant ||
                      '',

                    roles:
                      Array.isArray(
                        department.roles
                      )
                        ? department.roles
                        : [],

                    createdAt:
                      department.createdAt ||
                      null,

                    updatedAt:
                      department.updatedAt ||
                      null,
                  })
                )

            setDepartments(
              firestoreDepartments
            )

            console.log(
              'DEPARTMENTS LOADED:',
              firestoreDepartments
            )
          },
          (error) => {
            console.error(
              'Failed to listen to departments:',
              error
            )

            setDepartments([])
          }
        )

        /* --------------------------------
           ACCOUNTABILITY GROUPS
        -------------------------------- */

        unsubscribeGroups = onSnapshot(
          collection(
            db,
            GROUPS_COLLECTION
          ),
          (snapshot) => {
            const uniqueGroupNames = new Map()

            snapshot.docs.forEach(
              (item) => {
                const name =
                  item.data().name?.trim()

                if (!name) {
                  return
                }

                const normalizedName =
                  name.toLowerCase()

                /*
                 * Keep only one copy of each
                 * group name in the application.
                 */
                if (
                  !uniqueGroupNames.has(
                    normalizedName
                  )
                ) {
                  uniqueGroupNames.set(
                    normalizedName,
                    name
                  )
                }
              }
            )

            const firestoreGroups = [
              ...uniqueGroupNames.values(),
            ]

            setGroups(
              firestoreGroups
            )

            console.log(
              'ACCOUNTABILITY GROUPS LOADED:',
              firestoreGroups
            )
          },
          (error) => {
            console.error(
              'Failed to listen to groups:',
              error
            )

            /*
             * Do not inject fake/default groups.
             * Groups must come from Firestore.
             */
            setGroups([])
          }
        )
      } catch (error) {
        console.error(
          'Failed to load Firestore data:',
          error
        )

        setMembers(initialMembers)
        setDepartments([])
        setGroups([])
      } finally {
        setLoading(false)
      }
    }

    loadData()

    /* --------------------------------
       CLEANUP FIRESTORE LISTENERS
    -------------------------------- */

    return () => {
      if (unsubscribeMembers) {
        unsubscribeMembers()
      }

      if (unsubscribeDepartments) {
        unsubscribeDepartments()
      }

      if (unsubscribeGroups) {
        unsubscribeGroups()
      }
    }
  }, [])

  /* ==========================================================
     ADD MEMBER / STUDENT
  ========================================================== */

  const addMember = async (newMember) => {
    const member = {
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

      admissionNumber:
        newMember.admissionNumber ||
        newMember.admission_number ||
        '',

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

      residence:
        newMember.residence || '',

      location:
        newMember.location || '',

      address:
        newMember.address || '',

      type:
        newMember.type || 'student',

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

      group:
        newMember.group ||
        newMember.accountabilityGroup ||
        '',

      status:
        newMember.status || 'Active',

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
        (currentMembers) => {
          if (
            currentMembers.some(
              (currentMember) =>
                currentMember.id ===
                savedMember.id
            )
          ) {
            return currentMembers
          }

          return [
            ...currentMembers,
            savedMember,
          ]
        }
      )

      /*
       * If the member belongs to a department,
       * make sure that department exists.
       */
      if (member.department?.trim()) {
        const departmentName =
          member.department.trim()

        const existingDepartment =
          departments.find(
            (department) =>
              department.name?.toLowerCase() ===
              departmentName.toLowerCase()
          )

        if (!existingDepartment) {
          await addDoc(
            collection(
              db,
              DEPARTMENTS_COLLECTION
            ),
            {
              name: departmentName,
              leader: '',
              assistant: '',
              roles: [],
              createdAt:
                new Date().toISOString(),
              updatedAt:
                new Date().toISOString(),
            }
          )
        }
      }

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

      roles:
        Array.isArray(roles)
          ? roles
          : [],

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
        (currentDepartments) => {
          if (
            currentDepartments.some(
              (currentDepartment) =>
                currentDepartment.id ===
                savedDepartment.id
            )
          ) {
            return currentDepartments
          }

          return [
            ...currentDepartments,
            savedDepartment,
          ]
        }
      )

      console.log(
        'DEPARTMENT CREATED:',
        savedDepartment
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
      return null
    }

    const alreadyExists =
      groups.some(
        (group) =>
          group.toLowerCase() ===
          cleanName.toLowerCase()
      )

    if (alreadyExists) {
      return null
    }

    const group = {
      name: cleanName,

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
            GROUPS_COLLECTION
          ),
          group
        )

      const savedGroup = {
        id: document.id,
        ...group,
      }

      /*
       * Keep the local state synchronized
       * immediately. Firestore's listener will
       * also confirm the final state.
       */
      setGroups(
        (currentGroups) => {
          const exists =
            currentGroups.some(
              (currentGroup) =>
                currentGroup.toLowerCase() ===
                cleanName.toLowerCase()
            )

          if (exists) {
            return currentGroups
          }

          return [
            ...currentGroups,
            cleanName,
          ]
        }
      )

      console.log(
        'ACCOUNTABILITY GROUP CREATED:',
        savedGroup
      )

      return savedGroup
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

    if (
      oldName?.toLowerCase() ===
      cleanName.toLowerCase()
    ) {
      return
    }

    const duplicateGroup =
      groups.some(
        (group) =>
          group.toLowerCase() ===
          cleanName.toLowerCase()
      )

    if (duplicateGroup) {
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

      const groupDocuments =
        groupsSnapshot.docs.filter(
          (item) =>
            item.data().name?.trim().toLowerCase() ===
            oldName?.trim().toLowerCase()
        )

      /*
       * Update every Firestore document with
       * the old name so duplicate records do
       * not leave stale names behind.
       */
      for (
        const groupDocument
        of groupDocuments
      ) {
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
        (currentGroups) => {
          const nextGroups =
            currentGroups.map(
              (group) =>
                group === oldName
                  ? cleanName
                  : group
            )

          return [
            ...new Set(
              nextGroups
            ),
          ]
        }
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

      const groupDocuments =
        groupsSnapshot.docs.filter(
          (item) =>
            item.data().name?.trim().toLowerCase() ===
            groupName?.trim().toLowerCase()
        )

      /*
       * Delete every Firestore document with
       * this group name.
       */
      for (
        const groupDocument
        of groupDocuments
      ) {
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
              group.toLowerCase() !==
              groupName.toLowerCase()
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
  return useContext(MemberContext)
}