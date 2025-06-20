// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Para reCAPTCHA

// Importar rutas
const contactoRoutes = require('./routes/contactos');
const solicitudRoutes = require('./routes/solicitudes');
const qrRoutes = require('./routes/qr');
const mailerRoutes = require('./routes/mailer');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Montar rutas principales
app.use('/api/contactos', contactoRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/mailer', mailerRoutes);

// Ruta para login con reCAPTCHA
app.post('/api/login', async (req, res) => {
  const { username, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'Token de reCAPTCHA faltante' });
  }

  const secretKey = '6LdmEF8rAAAAABW2VCYBp_IGP7DOIIRcTU8E-IyV'; // Sustituye con tu clave real

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA no válido' });
    }

    // Aquí iría la lógica de autenticación
    res.status(200).json({ message: 'Login exitoso' });
  } catch (error) {
    console.error('Error al verificar el reCAPTCHA:', error);
    return res.status(500).json({ message: 'Error al verificar el reCAPTCHA' });
  }
});

// Ruta para registro de usuario con reCAPTCHA
app.post('/api/register', async (req, res) => {
  const { nombre, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'Token de reCAPTCHA faltante' });
  }

  const secretKey = '6LdmEF8rAAAAABW2VCYBp_IGP7DOIIRcTU8E-IyV'; // Sustituye con tu clave real

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA no válido' });
    }

    // Aquí iría la lógica de registro
    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error al verificar el reCAPTCHA:', error);
    return res.status(500).json({ message: 'Error al verificar el reCAPTCHA' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
