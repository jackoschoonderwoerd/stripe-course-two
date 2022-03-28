// 22.01 create database.ts

// 22.02 require firestore & create serviceAccountPath
// 22.02 B https://googleapis.dev/nodejs/firestore/latest/index.html
const Firestore = require('@google-cloud/firestore');
// 22.02 C relative path
const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;


// 22.03 create db
export const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: serviceAccountPath
});

// 22.04 create & export function
export async function getDocData(docPath) {
  const snap = await db.doc(docPath).get();

  return snap.data();
}