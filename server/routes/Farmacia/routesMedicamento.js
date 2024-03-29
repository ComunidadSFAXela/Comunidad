const express = require("express");
const router = express.Router();
const Medicamento = require("../../models/Farmacia/medicamentoModel.js");
const IngresoMedicamento = require("../../models/Farmacia/ingresoMedModel.js");
const EgresoMedicamento = require("../../models/Farmacia/egresoMedModel.js");

//======= crear nuevo medicamento =======
router.post("/medicamento/add", async (req, res) => {
  try {
    const { label, cantidadTotal, tipo, precio, fotos, descripcion, observaciones, antibiotico, estado } = req.body;

    const medicamento = new Medicamento({
      label,
      cantidadTotal,
      tipo,
      precio,
      fotos,
      descripcion,
      observaciones,
      antibiotico,
      estado,
    });

    // Guardar el objeto user en la base de datos u otras operaciones necesarias
    const resultado = await medicamento.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res.status(200).json({ message: "Medicamento añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir el medicamento Social",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los medicamentos =======
router.get("/medicamento/getall", async (req, res) => {
  try {
    const data = await Medicamento.find().where({ estado: true }).sort({ label: 1 }).exec();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los medicamentos",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los medicamentos =======
router.get("/medicamento/getalldisponibility", async (req, res) => {
  try {
    const data = await Medicamento.find().where({ estado: true }).sort({ cantidadTotal: -1 }).exec();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los medicamentos",
      messageSys: error.message,
    });
  }
});

// Agrega esta ruta al final del archivo de rutas
router.post("/medicamento/filtrar", async (req, res) => {
  try {
    const { label } = req.body;

    const medicamentos = await Medicamento.find({ label: { $regex: label, $options: "i" } })
      .where({ estado: true })
      .sort({ label: 1 })
      .exec();

    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo realizar la búsqueda de los medicamentos",
      messageSys: error.message,
    });
  }
});

// ======= obtener un medicamento por su id =======
router.get("/medicamento/getbyid/:id", async (req, res) => {
  try {
    const data = await Medicamento.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener el medicamento por el id: " + req.params.id,
      messageSys: error.message,
    });
  }
});

// ======= actualizar un medicamento por su id =======
router.put("/medicamento/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Medicamento.findByIdAndUpdate(id, data, options);
    res.status(200).json({ message: "Medicamento actualizado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar el medicamento",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un medicamento por su id =======
router.put("/medicamento/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Medicamento.findByIdAndUpdate(id, data, options);
    res.status(200).json({ message: "Medicamento eliminado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar el medicamento",
      messageSys: error.message,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// ================================= Añadir medicamentos ============================= //
/////////////////////////////////////////////////////////////////////////////////////////

//======= crear nuevo ingreso de medicamento =======
router.post("/IngresoMedicamento/add", async (req, res) => {
  try {
    const { idmedicamento, cantidad, fecha, precioCompra, precioVenta, fechaVencimiento, proveedor, observaciones } =
      req.body;

    const medicamento = new IngresoMedicamento({
      idmedicamento,
      cantidad,
      fecha,
      precioCompra,
      precioVenta,
      fechaVencimiento,
      proveedor,
      observaciones,
    });

    // Guardar el objeto IngresoSaldo en la base de datos
    const ingresoMedicamentoResultado = await medicamento.save();

    // Actualizar el saldoTotal del beneficiario
    await Medicamento.findByIdAndUpdate(
      idmedicamento,
      { $inc: { cantidadTotal: cantidad } } // Incrementa el total en el valor de cantidad
    );

    // Mandamos estado 200 de OK y el resultado de la operación
    res.status(200).json({ message: "Nueva compra de producto añadido correctamente", ingresoMedicamentoResultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir una nueva compra del producto",
      messageSys: error.message,
    });
  }
});

// Ruta GET para filtrar ingresos de medicamentos por rango de fechas
router.post("/IngresoMedicamento/getbyrange", async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.body;

    const ingresosMedicamentos = await IngresoMedicamento.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFinal),
      },
    })
      .select("idmedicamento cantidad fecha precioCompra precioVenta proveedor observaciones")
      .populate("idmedicamento", "label")
      .exec();

    res.status(200).json({ ingresosMedicamentos });
  } catch (error) {
    res.status(500).json({
      messageDev: "Error al filtrar los ingresos de medicamentos por fecha",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un ingreso de medicamento por su id =======
router.delete("/IngresoMedicamento/delete/:id", async (req, res) => {
  try {
    await IngresoMedicamento.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar el registro",
      messageSys: error.message,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// ============================ Añadir egreso medicamento =========================== //
/////////////////////////////////////////////////////////////////////////////////////////

//======= crear nuevo egreso de medicamento =======
router.post("/EgresoMedicamento/add", async (req, res) => {
  try {
    const { idmedicamento, cantidad, fecha, precioVenta } = req.body;

    const medicamento = new EgresoMedicamento({
      idmedicamento,
      cantidad,
      fecha,
      precioVenta,
    });

    // Guardar el objeto IngresoSaldo en la base de datos
    const egresoMedicamentoResultado = await medicamento.save();

    // Actualizar el saldoTotal del beneficiario
    await Medicamento.findByIdAndUpdate(
      idmedicamento,
      { $inc: { cantidadTotal: -cantidad } } // decrementa la cantidad
    );

    // Mandamos estado 200 de OK y el resultado de la operación
    res.status(200).json({ message: "Egreso de producto añadido correctamente", egresoMedicamentoResultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir un nuevo egreso al producto",
      messageSys: error.message,
    });
  }
});

// Ruta GET para filtrar ingresos de medicamentos por rango de fechas
router.post("/EgresoMedicamento/getbyrange", async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.body;

    const egresoMedicamentos = await EgresoMedicamento.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFinal),
      },
    })
      .select("idmedicamento cantidad fecha precioVenta")
      .populate("idmedicamento", "label")
      .exec();

    res.status(200).json({ egresoMedicamentos });
  } catch (error) {
    res.status(500).json({
      messageDev: "Error al filtrar los egresos de medicamentos por fecha",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un egreso de medicamento por su id =======
router.delete("/EgresoMedicamento/delete/:id", async (req, res) => {
  try {
    await EgresoMedicamento.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar el registro",
      messageSys: error.message,
    });
  }
});

module.exports = router;
