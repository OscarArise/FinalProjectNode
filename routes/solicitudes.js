const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { db } = require('../models/firebase');
const collection = db.collection('solicitudes');

// Crear nueva solicitud
router.post(
  '/',
  [
    body('nombre').isLength({ min: 3 }),
    body('telefono').isNumeric().isLength({ min: 7, max: 15 }),
    body('claseSeleccionada').notEmpty(),
    body('fecha').notEmpty(),
    body('publicidad').isBoolean(),
    body('usuarioId').notEmpty()
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      await collection.add(req.body);
      res.status(201).json({ mensaje: 'Solicitud guardada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Obtener todas las solicitudes
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const solicitudes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener solicitudes por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const snapshot = await collection.where('usuarioId', '==', req.params.usuarioId).get();
    const solicitudes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar una solicitud
router.put('/:id', [
  body('nombre').isLength({ min: 3 }),
  body('telefono').isNumeric().isLength({ min: 7, max: 15 }),
  body('claseSeleccionada').notEmpty(),
  body('fecha').notEmpty(),
  body('publicidad').isBoolean(),
  body('usuarioId').notEmpty()
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    await collection.doc(req.params.id).update(req.body);
    res.status(200).json({ mensaje: 'Solicitud actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una solicitud
router.delete('/:id', async (req, res) => {
  try {
    await collection.doc(req.params.id).delete();
    res.status(200).json({ mensaje: 'Solicitud eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
