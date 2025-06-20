const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
<<<<<<< HEAD
=======

>>>>>>> saul
const serviceAccount = require('../config/firebase-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
<<<<<<< HEAD
module.exports = { db };
=======
module.exports = { db };
>>>>>>> saul
