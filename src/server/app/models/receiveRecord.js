const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiveRecordSchema = new Schema({
    value: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReceiveRecord', receiveRecordSchema);
