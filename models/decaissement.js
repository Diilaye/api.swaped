const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const decaissementModel = new Schema({

    title: {
        type: String,
        default: ''
    },

    minPrice: {
        type: Number, default: 0,
    },

    maxPrice: {
        type: Number, default: 0,
    },


}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('decaissement', decaissementModel);