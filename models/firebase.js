const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./pruebasfirebase-c2278-firebase-adminsdk-fbsvc-97b8b5341c.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
module.exports = { db };