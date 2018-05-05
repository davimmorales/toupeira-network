const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sendRecordSchema = new Schema({
    value: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SendRecord', sendRecordSchema);
