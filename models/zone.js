const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const zoneModel = new Schema({


    title: {
        type: String,
        default: ''
    },

    subZone: [{
        type: Map,
    }],
    


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

module.exports = mongoose.model('zones', zoneModel);