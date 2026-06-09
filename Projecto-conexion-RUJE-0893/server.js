// Rodriguez Ugalde Jaime Emmanuel 4°J 0893  

// pido prestado express para hacer mi servidor
const express = require('express');
// traigo mongoose para conectarme a mi base de datos
const mongoose = require('mongoose');
// uso cors para que mi pagina web se pueda comunicar con mi servidor sin problemas
const cors = require('cors');

// creo mi aplicacion con express
const app = express();

// le digo a mi aplicacion que entienda el formato json que le mando
app.use(express.json());
// esto es para que entienda los datos que vienen de formularios de html
app.use(express.urlencoded({ extended: true }));
// le digo donde estan mis archivos de la pagina como el html y el css
app.use(express.static(__dirname));
// activo cors
app.use(cors());

// aqui guardo la direccion secreta de mi base de datos en internet
const MONGO_URI = "mongodb://Jaime:Jaime123@ac-2vybyim-shard-00-00.xn3pshg.mongodb.net:27017,ac-2vybyim-shard-00-01.xn3pshg.mongodb.net:27017,ac-2vybyim-shard-00-02.xn3pshg.mongodb.net:27017/ConsultorioElysia?ssl=true&replicaSet=atlas-6qkfzv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RDZUGALDEJAIME";

// me conecto a la base de datos usando la direccion de arriba
mongoose.connect(MONGO_URI)
    // si me conecto bien imprimo un mensaje feliz
    .then(() => console.log("¡Conectado exitosamente a MongoDB Atlas (Elysia)!"))
    // si algo sale mal imprimo el error para saber que paso
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// aqui digo que datos va a tener un paciente
const PacienteSchema = new mongoose.Schema({
    numero: String,
    nombre: String,
    nacimiento_edad: String,
    estado_civil_ocupacion: String,
    direccion: String,
    datos_medicos: String,
    emergencia: String
});
// creo el modelo paciente con los datos de arriba
const Paciente = mongoose.model('Paciente', PacienteSchema);

// defino que informacion voy a guardar de los doctores
const DoctorSchema = new mongoose.Schema({
    numero: String,
    nombre: String,
    especialidad: String,
    horario: String,
    academica: String,
    fiscales: String,
    contacto: String
});
// creo el modelo doctor
const Doctor = mongoose.model('Doctor', DoctorSchema);

// esta es la estructura para guardar las citas
const CitaSchema = new mongoose.Schema({
    id_fecha: String,
    paciente_especialista: String,
    motivo: String,
    triage: String,
    estado_plan: String
});
// armo el modelo de la cita
const Cita = mongoose.model('Cita', CitaSchema);

// y asi se van a guardar las facturas
const FacturaSchema = new mongoose.Schema({
    ticket: String,
    paciente: String,
    concepto: String,
    metodo_pago: String,
    rfc: String,
    total: String
});
// hago el modelo para factura
const Factura = mongoose.model('Factura', FacturaSchema);

// esta parte es para guardar un paciente nuevo cuando envian el formulario
app.post('/api/pacientes', async (req, res) => {
    // intento guardar al paciente
    try {
        // creo un paciente nuevo con los datos que me mandaron
        const nuevo = new Paciente(req.body);
        // lo guardo en la base de datos de verdad
        await nuevo.save();
        // si todo sale bien muestro un aviso y regreso a la pagina de pacientes
        res.send("<script>alert('Paciente guardado correctamente'); window.location.href='/pacientes.html';</script>");
    } catch (error) {
        // si hay un error aviso que no se pudo
        res.status(500).send("<script>alert('Error al registrar al paciente'); window.location.href='/pacientes.html';</script>");
    }
});

// con esto guardo a un nuevo doctor desde su formulario
app.post('/api/doctores', async (req, res) => {
    try {
        // preparo al doctor con la info que llego
        const nuevo = new Doctor(req.body);
        // lo meto a la base de datos
        await nuevo.save();
        // aviso que se guardo y me regreso a la pagina
        res.send("<script>alert('Doctor registrado correctamente'); window.location.href='/doctores.html';</script>");
    } catch (error) {
        // mando mensaje de error si fallo
        res.status(500).send("<script>alert('Error al registrar al doctor'); window.location.href='/doctores.html';</script>");
    }
});

// aqui recibo los datos para crear una nueva cita
app.post('/api/citas', async (req, res) => {
    try {
        // armo la cita
        const nueva = new Cita(req.body);
        // la guardo
        await nueva.save();
        // aviso de exito y devuelvo al usuario a la vista de citas
        res.send("<script>alert('Cita programada correctamente'); window.location.href='/citas.html';</script>");
    } catch (error) {
        // aviso si hubo un problema
        res.status(500).send("<script>alert('Error al agendar la cita'); window.location.href='/citas.html';</script>");
    }
});

// ruta para guardar facturas nuevas
app.post('/api/facturas', async (req, res) => {
    try {
        // creo la factura
        const nueva = new Factura(req.body);
        // la mando guardar
        await nueva.save();
        // muestro alerta y redirijo
        res.send("<script>alert('Factura guardada correctamente'); window.location.href='/facturas.html';</script>");
    } catch (error) {
        // muestro alerta de que algo fallo
        res.status(500).send("<script>alert('Error al generar la factura'); window.location.href='/facturas.html';</script>");
    }
});

// de aqui saco todos los pacientes para verlos en la tabla
app.get('/api/pacientes', async (req, res) => {
    try {
        // busco todos los pacientes guardados
        const datos = await Paciente.find();
        // los envio de regreso en formato json
        res.json(datos);
    } catch (error) {
        // mando error por si no los pude sacar
        res.status(500).json({ error: "Error al obtener pacientes" });
    }
});

// con esta saco la lista de doctores
app.get('/api/doctores', async (req, res) => {
    try {
        // le pido a la base de datos todos los doctores
        const datos = await Doctor.find();
        // se los doy a la pagina
        res.json(datos);
    } catch (error) {
        // envio un error si se rompio
        res.status(500).json({ error: "Error al obtener doctores" });
    }
});

// ruta para ver todas las citas agendadas
app.get('/api/citas', async (req, res) => {
    try {
        // busco las citas
        const datos = await Cita.find();
        // respondo con las citas encontradas
        res.json(datos);
    } catch (error) {
        // por si algo sale mal
        res.status(500).json({ error: "Error al obtener las citas" });
    }
});

// esto me trae las facturas hechas
app.get('/api/facturas', async (req, res) => {
    try {
        // pido las facturas
        const datos = await Factura.find();
        // las regreso
        res.json(datos);
    } catch (error) {
        // aviso si hubo error
        res.status(500).json({ error: "Error al obtener facturas" });
    }
});

// aqui actualizo los datos de un paciente si me mandan un id
app.put('/api/pacientes/:id', async (req, res) => {
    // busco por id y le pongo la informacion nueva y aviso que si se pudo
    try { await Paciente.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // aviso si fallo
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// actualizo la info de un doctor
app.put('/api/doctores/:id', async (req, res) => {
    // lo actualizo por id
    try { await Doctor.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // mando error si pasa
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// con esto edito una cita existente
app.put('/api/citas/:id', async (req, res) => {
    // actualizo la cita
    try { await Cita.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // cacho el error si falla
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// edito una factura
app.put('/api/facturas/:id', async (req, res) => {
    // actualizo los datos de la factura
    try { await Factura.findByIdAndUpdate(req.params.id, req.body); res.json({ success: true }); }
    // si no se pudo tiro error
    catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
});

// con esta ruta elimino un paciente que ya no quiero
app.delete('/api/pacientes/:id', async (req, res) => {
    // busco el paciente por su id y lo borro
    try { await Paciente.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // si hay problema aviso
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// borro a un doctor de mis registros
app.delete('/api/doctores/:id', async (req, res) => {
    // lo elimino usando su id
    try { await Doctor.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // muestro error si falla
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// quito una cita cancelada
app.delete('/api/citas/:id', async (req, res) => {
    // desaparezco la cita
    try { await Cita.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // atrapo cualquier error
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// borro una factura
app.delete('/api/facturas/:id', async (req, res) => {
    // le digo a la base de datos que la borre
    try { await Factura.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    // devuelvo error si no se pudo borrar
    catch (error) { res.status(500).json({ error: "Error al eliminar" }); }
});

// defino en que puerto se va a levantar mi servidor
const PORT = 5000;
// arranco mi servidor y pongo un mensaje en la terminal para saber donde esta corriendo
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));