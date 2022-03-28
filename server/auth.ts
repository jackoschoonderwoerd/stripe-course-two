// 28.00 setup backend authentication this will verify the jwt
// 28.01 create auth.ts

const admin = require('firebase-admin');

const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseUrl: process.env.FIRESTORE_DATABASE_URL // 28.02 TODO necesary?
});

export const auth = admin.auth();