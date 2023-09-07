const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdresseModels = new Schema({

    type  : {
        type: String,
        enum: ['Domicile' ,'Bureau','autres'],
        default: 'Domicile',
    },

    rue : {
        type: String,
        default :""
    },

    ville : {
        type: String,
        default :""
    },

    pays : {
        type: String,
        default:""
    },

    localisation : {
        type: Map,
    },

    user : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    }


},{
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
},{
    timestamps: true 
});

module.exports = mongoose.model('adresses', AdresseModels) ;