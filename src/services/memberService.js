import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

import { db } from '../firebase'

const MEMBERS_COLLECTION = 'members'


/* ============================================================
   GET ALL MEMBERS
============================================================ */

export async function getMembers() {
  const snapshot = await getDocs(
    collection(db, MEMBERS_COLLECTION)
  )

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}


/* ============================================================
   CREATE MEMBER
============================================================ */

export async function createMember(member) {
  const now = new Date().toISOString()

  const memberData = {
    name: member.name || '',
    firstName: member.firstName || '',
    middleName: member.middleName || '',
    lastName: member.lastName || '',
    gender: member.gender || '',

    admissionNumber:
      member.admissionNumber ||
      member.admission_number ||
      '',

    email: member.email || '',

    phone:
      member.phone ||
      member.phoneNumber ||
      '',

    alternativePhone:
      member.alternativePhone ||
      member.alternative_phone ||
      '',

    residence: member.residence || '',
    location: member.location || '',
    address: member.address || '',

    type: member.type || 'student',

    year:
      member.type === 'student'
        ? member.year || ''
        : null,

    course:
      member.type === 'student'
        ? member.course || ''
        : null,

    department: member.department || '',

    group:
      member.group ||
      member.accountabilityGroup ||
      '',

    status: member.status || 'Active',

    createdAt: now,
    updatedAt: now,
  }

  const document = await addDoc(
    collection(db, MEMBERS_COLLECTION),
    memberData
  )

  return {
    id: document.id,
    ...memberData,
  }
}


/* ============================================================
   UPDATE MEMBER
============================================================ */

export async function updateMember(
  memberId,
  updates
) {
  const memberRef = doc(
    db,
    MEMBERS_COLLECTION,
    memberId
  )

  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await updateDoc(
    memberRef,
    updatedData
  )

  return {
    id: memberId,
    ...updatedData,
  }
}


/* ============================================================
   DELETE MEMBER
============================================================ */

export async function removeMember(memberId) {
  const memberRef = doc(
    db,
    MEMBERS_COLLECTION,
    memberId
  )

  await deleteDoc(memberRef)

  return memberId
}