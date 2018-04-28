var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegistroSchema = new Schema({
    valor: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registro', RegistroSchema);