const express = require('express');
const router = express.Router();
const { db } = require('../models/firebase');
const collection = db.collection('contactos');

router.get('/:id', async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Retorna el documento con su ID como parte del JSON
    res.status(200).json({ id: doc.id, ...doc.data() });

    //const snapshot = await collection.where('id', '==', req.params.id).get();
    //const contactos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //res.status(200).json(contactos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
