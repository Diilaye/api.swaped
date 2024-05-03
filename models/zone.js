const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const zoneModel = new Schema({


    zonetitle: {
        type: String,
        default: ''
    },

    depart: {
        type: String,
    },

    arrive: {
        type: String,
    },

    prix: { type: Number, default: 0 },



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

module.exports = mongoose.model('zone', zoneModel);