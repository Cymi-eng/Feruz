import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore'

import { db } from './firebase'

const GROUPS_COLLECTION = 'groups'

const DEFAULT_GROUPS = [
  'Group 1',
  'Group 2',
  'Group 3',
  'Group 4',
  'Group 5',
  'Group 6',
  'Group 7',
]

export async function initializeGroups() {
  try {
    const snapshot = await getDocs(
      collection(db, GROUPS_COLLECTION)
    )

    if (!snapshot.empty) {
      return
    }

    for (const name of DEFAULT_GROUPS) {
      await addDoc(
        collection(db, GROUPS_COLLECTION),
        {
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      )
    }

    console.log(
      'Default accountability groups created.'
    )
  } catch (error) {
    console.error(
      'Failed to initialize groups:',
      error
    )

    throw error
  }
}