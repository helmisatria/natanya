import * as admin from 'firebase-admin'
import invariant from 'invariant'

invariant(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required')
invariant(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, 'NEXT_PUBLIC_FIREBASE_DATABASE_URL is required')
invariant(process.env.FIREBASE_CLIENT_EMAIL, 'FIREBASE_CLIENT_EMAIL is required')
invariant(process.env.FIREBASE_PRIVATE_KEY, 'FIREBASE_PRIVATE_KEY is required')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.database()

export { db }
