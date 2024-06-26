const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VehiculeModel = new Schema({

    service: {
        type: String,
    },

    typeVehicule: {
        type: String,
        enum: ['moto', 'voiture'],
        default: 'moto'
    },

    localisation: {
        type: Map,
        default: {
            lat: 9.5931494,
            lng: -13.64572
        }
    },


    typeLuxe: {
        type: String,
        enum: ['standard', 'classic', 'confort'],
        default: 'standard'
    },


    pays: {
        type: String,
        enum: ['gn', 'ci', 'sn'],
        default: 'gn'
    },

    online: {
        type: String,
        enum: ['on', 'off', 'suspend'],
        default: 'off'
    },

    idParent: {
        type: Schema.Types.ObjectId,
        ref: "user-admin"
    },

    nomEntreprise: {
        type: String,
        default: ""
    },

    nom: {
        type: String,
        default: ""
    },

    prenom: {
        type: String,
        default: ""
    },

    marque: {
        type: String,
        default: ""
    },

    modelVehicule: {
        type: String,
        default: ""
    },

    couleur: {
        type: String,
        default: ""
    },

    immatriculation: {
        type: String,
        default: ""
    },

    descriptionEntreprise: {
        type: String,
        default: ""
    },

    telephone: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    photoProfile: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    pieceIdentite: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    permisConduire: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    permisConduire: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    photoVehicule: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    assurance: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    carteGrise: {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    walletDriver: {
        type: Schema.Types.ObjectId,
        ref: "wallet",
    },

    notes: [{
        type: String,
        default: []
    }],

    commentaires: [{
        type: String,
        default: []
    }],

    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'courses-model',
        default: []
    }],

    coursesActif: [{
        type: Schema.Types.ObjectId,
        ref: 'courses-model',
        default: []
    }],

    courseSelected: {
        type: Schema.Types.ObjectId,
        ref: 'courses-model',
        default: null
    },

    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'wallet-transactions',
        default: []
    }],

    status: {
        type: String,
        default: "inactive"
    },

    notre: {
        type: String,
        enum: ['oui', 'non'],
        default: 'non'
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

module.exports = mongoose.model('mobilite', VehiculeModel);