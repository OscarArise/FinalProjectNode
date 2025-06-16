const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas existentes
const contactoRoutes = require('./routes/contactos');
const solicitudRoutes = require('./routes/solicitudes');
// Importar la ruta del QR
const qrRoutes = require('./routes/qr');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Montar rutas
app.use('/api/contactos', contactoRoutes);
app.use('/api/solicitudes', solicitudRoutes);
// Montar la ruta de QR: GET /api/qr/:id
app.use('/api/qr', qrRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
