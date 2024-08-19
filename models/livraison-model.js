const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LivraisonModel = new Schema({

    clientPhone: {
        type: String,
        default: ''
    },


    mobilite: {
        type: Schema.Types.ObjectId,
        ref: "mobilite",
        default: null
    },

    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
        default: null
    },


    prix_livraison: {
        type: Number
    },

    prix_repas: {
        type: Number
    },


    addresseDepart: {
        type: String,
        default: ''
    },

    addresseArrive: {
        type: String,
        default: ''
    },

    dateCourses: {
        type: String,
        default: ''
    },

    heuresCourses: {
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

module.exports = mongoose.model('livraison-model', LivraisonModel);