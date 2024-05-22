const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const zoneModel = new Schema({



    mobilite: {
        type: Schema.Types.ObjectId,
        ref: "user-admin",
        default: null
    },




    prix: {
        type: Number
    },


    title: {
        type: String,
        default: ''
    },

    dateCourses: {
        type: String,
        default: ''
    }


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

module.exports = mongoose.model('depenses', zoneModel);