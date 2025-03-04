const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const GuiasRoutes = require('./guideRoutes');

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de administración
router.use('/admin', adminRoutes);

//Rutas de Guias
router.use('/guias', GuiasRoutes);

module.exports = router;
