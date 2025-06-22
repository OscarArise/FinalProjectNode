const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { db } = require('../models/firebase');
const collection = db.collection('contactos');

// POST: Crear un contacto
router.post(
  '/',
  [
    body('nombre').isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
    body('email').isEmail().withMessage('Email inválido').isLength({ min: 4 }),
    body('asunto').isLength({ min: 10 }).withMessage('El asunto debe tener al menos 10 caracteres'),
    body('mensaje').isLength({ min: 20 }).withMessage('El mensaje debe tener al menos 20 caracteres'),
    body('usuarioId').notEmpty().withMessage('El id de usuario es obligatorio')
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const data = req.body;
      await collection.add(data);
      res.status(201).json({ mensaje: 'Contacto guardado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET: Obtener todos los contactos
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const contactos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(contactos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener contactos por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const snapshot = await collection.where('usuarioId', '==', req.params.usuarioId).get();
    const contactos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(contactos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Editar un contacto
router.put('/:id', [
  body('nombre').isLength({ min: 5 }),
  body('email').isEmail().isLength({ min: 4 }),
  body('asunto').isLength({ min: 10 }),
  body('mensaje').isLength({ min: 20 }),
  body('usuarioId').notEmpty()
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    await collection.doc(req.params.id).update(req.body);
    res.status(200).json({ mensaje: 'Contacto actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Eliminar un contacto
router.delete('/:id', async (req, res) => {
  try {
    await collection.doc(req.params.id).delete();
    res.status(200).json({ mensaje: 'Contacto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
