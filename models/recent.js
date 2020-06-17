const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecentSchema = new Schema({
    ip: {
        type: String,
        required: true
    },
    prodids: [{
        prodid: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Recent', RecentSchema);