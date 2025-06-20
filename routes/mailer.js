const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configuración del transportador de NodeMailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'impiriogym@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
    }
  });
};

// Ruta para enviar correos desde el formulario de contacto
router.post(
  '/enviar-contacto',
  [
    body('correo').isEmail().withMessage('Email inválido'),
    body('mensaje').isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { correo, mensaje } = req.body;
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER || 'impiriogym@gmail.com',
        to: 'impiriogym@gmail.com',
        subject: 'Nuevo mensaje de contacto desde la web',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a, #C9B243); padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="color: white; text-align: center; margin: 0;">Nuevo Mensaje de Contacto</h2>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
              <h3 style="color: #C9B243; border-bottom: 2px solid #C9B243; padding-bottom: 10px;">Detalles del Contacto</h3>
              <p><strong>Email del remitente:</strong> <span style="color: #1a1a1a;">${correo}</span></p>
              <div style="margin-top: 20px;">
                <h4 style="color: #C9B243;">Mensaje:</h4>
                <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #C9B243;">
                  ${mensaje.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
                <p style="margin: 0; font-size: 12px; color: #666;">
                  Este mensaje fue enviado desde el formulario de contacto de la página web.
                  Fecha: ${new Date().toLocaleString('es-MX')}
                </p>
              </div>
            </div>
          </div>
        `,
        replyTo: correo // Para que puedas responder directamente al email del cliente
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);

      res.status(200).json({ 
        mensaje: 'Correo enviado exitosamente',
        messageId: info.messageId 
      });

    } catch (error) {
      console.error('Error al enviar correo:', error);
      res.status(500).json({ 
        error: 'Error al enviar el correo',
        detalles: error.message 
      });
    }
  }
);

// Ruta adicional para enviar correos de confirmación (opcional)
router.post(
  '/enviar-confirmacion',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('tipo').notEmpty().withMessage('El tipo de confirmación es requerido')
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { email, nombre, tipo } = req.body;
      const transporter = createTransporter();

      let asunto = '';
      let contenido = '';

      switch (tipo) {
        case 'solicitud':
          asunto = 'Confirmación de Solicitud - Gimnasio Eter';
          contenido = `
            <h2>¡Hola ${nombre}!</h2>
            <p>Hemos recibido tu solicitud correctamente.</p>
            <p>Nos pondremos en contacto contigo pronto.</p>
          `;
          break;
        case 'contacto':
          asunto = 'Confirmación de Mensaje - Gimnasio Eter';
          contenido = `
            <h2>¡Hola ${nombre}!</h2>
            <p>Hemos recibido tu mensaje correctamente.</p>
            <p>Te responderemos a la brevedad posible.</p>
          `;
          break;
        default:
          asunto = 'Confirmación - Gimnasio Eter';
          contenido = `<h2>¡Hola ${nombre}!</h2><p>Gracias por contactarnos.</p>`;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER || 'impiriogym@gmail.com',
        to: email,
        subject: asunto,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a, #C9B243); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; text-align: center; margin: 0;">Gimnasio Eter</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
              ${contenido}
              <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px; text-align: center;">
                <p style="margin: 0; color: #C9B243; font-weight: bold;">¡Gracias por elegirnos!</p>
              </div>
            </div>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email de confirmación enviado:', info.messageId);

      res.status(200).json({ 
        mensaje: 'Correo de confirmación enviado exitosamente',
        messageId: info.messageId 
      });

    } catch (error) {
      console.error('Error al enviar correo de confirmación:', error);
      res.status(500).json({ 
        error: 'Error al enviar el correo de confirmación',
        detalles: error.message 
      });
    }
  }
);

module.exports = router;