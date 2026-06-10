// Rodriguez Ugalde Jaime Emmanuel 4°J 0893  

// Traigo Express, que es la base para crear mi servidor web
const express = require('express');
// Traigo Mongoose, que me sirve para conectarme y hablar con la base de datos
const mongoose = require('mongoose');
// Traigo CORS para que mi página web y el servidor puedan conectarse sin bloqueos
const cors = require('cors');

// Empiezo a configurar mi aplicación web
const app = express();

// Configuro la app para que pueda entender datos en formato JSON
app.use(express.json());
// Configuro la app para que entienda los datos que escribo en los formularios HTML
app.use(express.urlencoded({ extended: true }));
// Le indico al servidor dónde están mis archivos HTML y de diseño (CSS)
app.use(express.static(__dirname));
// Activo el permiso CORS
app.use(cors());

// Enlace de conexión a mi base de datos en MongoDB Atlas
const MONGO_URI = "mongodb://Jaime:Jaime123@ac-2vybyim-shard-00-00.xn3pshg.mongodb.net:27017,ac-2vybyim-shard-00-01.xn3pshg.mongodb.net:27017,ac-2vybyim-shard-00-02.xn3pshg.mongodb.net:27017/ConsultorioElysia?ssl=true&replicaSet=atlas-6qkfzv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RDZUGALDEJAIME";

// Trato de conectarme a la base de datos
mongoose.connect(MONGO_URI)
    // Si la conexión sale bien, muestro este mensaje en la terminal
    .then(() => console.log("¡Conectado exitosamente a MongoDB Atlas (Elysia)!"))
    // Si algo falla al conectarme, muestro el error
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// Defino qué datos o campos va a llevar cada Paciente
const PacienteSchema = new mongoose.Schema({
    numero: String,
    nombre: String,
    fecha_nacimiento: String,
    edad: String,
    estado_civil: String,
    ocupacion: String,
    direccion: String,
    datos_medicos: String,
    emergencia: String
});
// Creo el modelo 'Paciente' basándonos en los datos de arriba
const Paciente = mongoose.model('Paciente', PacienteSchema, 'pacientes');

// Defino qué campos va a tener un Doctor
const DoctorSchema = new mongoose.Schema({
    numero: String,
    nombre: String,
    especialidad: String,
    consultorio: String,
    horario: String,
    universidad: String,
    cedula: String,
    rfc: String,
    curp: String,
    direccion: String,
    telefono: String
});
// Creo el modelo 'Doctor'
const Doctor = mongoose.model('Doctor', DoctorSchema, 'doctores');

// Defino qué campos va a tener una Cita
const CitaSchema = new mongoose.Schema({
    numero_cita: String,
    fecha_hora: String,
    paciente: String,
    especialista: String,
    motivo: String,
    triage: String,
    estado: String,
    plan_medico: String
});
// Creo el modelo 'Cita'
const Cita = mongoose.model('Cita', CitaSchema, 'citas');

// Defino los campos para las Facturas
const FacturaSchema = new mongoose.Schema({
    ticket: String,
    paciente: String,
    concepto: String,
    metodo_pago: String,
    detalles_pago: String,
    rfc: String,
    total: String
});
// Creo el modelo 'Factura'
const Factura = mongoose.model('Factura', FacturaSchema, 'facturas');

// Ruta (POST) que recibe los datos del formulario para crear un Paciente
app.post('/api/pacientes', async (req, res) => {
    // Intento realizar la acción, y si hay error, lo atrapo
    try {
        // Creo un nuevo paciente con los datos que llegaron
        const nuevo = new Paciente(req.body);
        // Guardo oficialmente al paciente en la base de datos
        await nuevo.save();
        // Si se guarda bien, sale una alerta y me devuelve a la página
        res.send("<script>alert('Paciente guardado correctamente'); window.location.href='/pacientes.html';</script>");
    } catch (error) {
        // Si algo falla, envío un aviso de error
        res.status(500).send("<script>alert('Error al registrar al paciente'); window.location.href='/pacientes.html';</script>");
    }
});

// Ruta (POST) para registrar un nuevo Doctor desde el formulario
app.post('/api/doctores', async (req, res) => {
    try {
        // Creo un nuevo doctor
        const nuevo = new Doctor(req.body);
        // Lo guardo en la base de datos
        await nuevo.save();
        // Si se guardó bien, lanzamos alerta y recargamos la página
        res.send("<script>alert('Doctor registrado correctamente'); window.location.href='/doctores.html';</script>");
    } catch (error) {
        // Mostramos error si hubo algún problema
        res.status(500).send("<script>alert('Error al registrar al doctor'); window.location.href='/doctores.html';</script>");
    }
});

// Ruta (POST) para agendar una nueva Cita
app.post('/api/citas', async (req, res) => {
    try {
        // Creo la nueva cita
        const nueva = new Cita(req.body);
        // Lo guardo en la base de datos
        await nueva.save();
        // Si se guardó bien, lanzamos alerta y recargamos la página
        res.send("<script>alert('Cita programada correctamente'); window.location.href='/citas.html';</script>");
    } catch (error) {
        // Mostramos error si hubo algún problema
        res.status(500).send("<script>alert('Error al agendar la cita'); window.location.href='/citas.html';</script>");
    }
});

// Ruta (POST) para generar una nueva Factura
app.post('/api/facturas', async (req, res) => {
    try {
        // Creo la factura
        const nueva = new Factura(req.body);
        // Lo guardo en la base de datos
        await nueva.save();
        // Si se guardó bien, lanzamos alerta y recargamos la página
        res.send("<script>alert('Factura guardada correctamente'); window.location.href='/facturas.html';</script>");
    } catch (error) {
        // Mostramos error si hubo algún problema
        res.status(500).send("<script>alert('Error al generar la factura'); window.location.href='/facturas.html';</script>");
    }
});

// Ruta (GET) que le pide a la base de datos todos los pacientes
app.get('/api/pacientes', async (req, res) => {
    try {
        // Busco a todos los pacientes almacenados
        const datos = await Paciente.find();
        // Envío la lista de pacientes a la página web en formato JSON
        res.json(datos);
    } catch (error) {
        // Aviso si ocurrió un error al sacar los datos
        res.status(500).json({ error: "Error al obtener pacientes" });
    }
});

// Ruta (GET) para sacar la lista de todos los doctores
app.get('/api/doctores', async (req, res) => {
    try {
        // Busco los datos en la base de datos
        const datos = await Doctor.find();
        // Se los mando a la página
        res.json(datos);
    } catch (error) {
        // Aviso si ocurrió un error al sacar los datos
        res.status(500).json({ error: "Error al obtener doctores" });
    }
});

// Ruta (GET) para cargar todas las citas en la tabla
app.get('/api/citas', async (req, res) => {
    try {
        // Busco los datos en la base de datos
        const datos = await Cita.find();
        // Se los mando a la página
        res.json(datos);
    } catch (error) {
        // Aviso si ocurrió un error al sacar los datos
        res.status(500).json({ error: "Error al obtener las citas" });
    }
});

// Ruta (GET) para cargar las facturas
app.get('/api/facturas', async (req, res) => {
    try {
        // Busco los datos en la base de datos
        const datos = await Factura.find();
        // Se los mando a la página
        res.json(datos);
    } catch (error) {
        // Aviso si ocurrió un error al sacar los datos
        res.status(500).json({ error: "Error al obtener facturas" });
    }
});

// Ruta (PUT) para actualizar los datos de un paciente usando su ID
app.put('/api/pacientes/:id', async (req, res) => {
    // Edito los datos y respondo que salió bien
    try { await Paciente.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// Ruta (PUT) para actualizar a un doctor por su ID
app.put('/api/doctores/:id', async (req, res) => {
    // Edito y guardo el cambio
    try { await Doctor.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// Ruta (PUT) para editar una cita existente
app.put('/api/citas/:id', async (req, res) => {
    // Edito y guardo el cambio
    try { await Cita.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// Ruta (PUT) para modificar una factura
app.put('/api/facturas/:id', async (req, res) => {
    // Edito y guardo el cambio
    try { await Factura.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// Ruta (DELETE) para borrar a un paciente de forma definitiva
app.delete('/api/pacientes/:id', async (req, res) => {
    // Lo busco por su ID y lo elimino
    try { await Paciente.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// Ruta (DELETE) para borrar a un doctor
app.delete('/api/doctores/:id', async (req, res) => {
    // Elimino la información
    try { await Doctor.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// Ruta (DELETE) para cancelar y borrar una cita
app.delete('/api/citas/:id', async (req, res) => {
    // Elimino la información
    try { await Cita.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// Ruta (DELETE) para borrar una factura
app.delete('/api/facturas/:id', async (req, res) => {
    // Elimino la información
    try { await Factura.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // Aviso si ocurrió un error al sacar los datos
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// Establezco en qué puerto (5000) va a funcionar mi servidor
const PORT = 5000;
// Enciendo el servidor y pongo un mensaje en la terminal
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));