const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursoCreciSchema = new Schema({
  nombre: string,
  fechainicio: Date,
  fechaFinal: Date,
  ofrenda: Number,
  horario: String,
  ubicacion: String,
  dirigidoA: String,
  dirigidoPor: String,
  tipo: String,
  estado: Boolean,
});

module.exports = mongoose.model("CursoCreci", cursoCreciSchema);