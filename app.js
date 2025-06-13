const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');  // Importa Axios para hacer la solicitud a Google

const contactoRoutes = require('./routes/contactos');
const solicitudRoutes = require('./routes/solicitudes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/contactos', contactoRoutes);
app.use('/api/solicitudes', solicitudRoutes);

// Ruta para login
app.post('/api/login', async (req, res) => {
  const { username, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'Token de reCAPTCHA faltante' });
  }

  // Verificación del token de reCAPTCHA con la API de Google
  const secretKey = '6LdmEF8rAAAAABW2VCYBp_IGP7DOIIRcTU8E-IyV';  // Sustituye con tu secret key de Google reCAPTCHA
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA no válido' });
    }

    // Lógica para verificar el login (aquí puedes agregar tu lógica de autenticación de usuarios)
    res.status(200).json({ message: 'Login exitoso' });
  } catch (error) {
    console.error('Error al verificar el reCAPTCHA:', error);
    return res.status(500).json({ message: 'Error al verificar el reCAPTCHA' });
  }
});

// Ruta para registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'Token de reCAPTCHA faltante' });
  }

  // Verificación del token de reCAPTCHA con la API de Google
  const secretKey = '6LdmEF8rAAAAABW2VCYBp_IGP7DOIIRcTU8E-IyV';  // Sustituye con tu secret key de Google reCAPTCHA
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA no válido' });
    }

    // Lógica para registrar el usuario (agregar la lógica de registro aquí)
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
