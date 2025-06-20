// routes/qr.js
const express = require('express');
const router = express.Router();
const { db } = require('../models/firebase');  // Ajusta la ruta si tu firebase está en otra carpeta
const collection = db.collection('solicitudes');

// GET /api/qr/:id
// Devuelve los datos de una solicitud para codificarlos en el QR
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = collection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Extraemos los datos
    const data = docSnap.data();
    return res.json(data);
  } catch (error) {
    console.error('Error al obtener solicitud para QR:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
