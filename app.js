const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const contactoRoutes = require('./routes/contactos');
const solicitudRoutes = require('./routes/solicitudes');


app.use(cors());
app.use(express.json());
//La ruta base /api/empleados se configura explícitamente  
//Todo lo que esté en el archivo routes/empleados.js se va a usar bajo la ruta /api/empleados
//app.use('/api/empleados', itemRoutes);

app.use(bodyParser.json()); 
app.use('/api/contactos', contactoRoutes);
app.use('/api/solicitudes', solicitudRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});