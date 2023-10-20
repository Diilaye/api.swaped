const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodePhoneModel = new Schema({

    code: {
        type: String,
    },

    phone: {
        type: String,

    },

    is_treat: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('code-phone', CodePhoneModel);