const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeplacementModels = new Schema({

    reference: {
        type: String ,
        unique : true,

    },

    client : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    mobilite : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
        default : null
    },

    prix_total : {
        type : Number
    },

    prix_offre : {
        type : Number
    },    

    pointDepart : {
        type : Map,
        default : {
            lat: 0,
            lng:0
        }
    },

    pointArrive : {
        type : Map,
        default : {
            lat: 0,
            lng:0
        }
    },

    addresseDepart : {
        type : String,
        default : ''
    },

    addresseArrive : {
        type : String,
        default : ''
    },

    statusLivraison: {
        type: String,
        enum: ['deplacement', 'livraison'],
        default: 'livraison'
    },

    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS','CANCELED'],
        default: 'PENDING'
    },

    etatLivraison: {
        type: String,
        enum: ['PENDING', 'DEPART-MOTO','DEPRAT-COURSE','SUCCESS' , 'CANCEL'],
        default: 'PENDING'
    },

    phonePaiement : {
        type : String,
    },

    contriePaiement : {
        type : String,
        default : 'GN'
    },

    means: {
        type: String,
        enum: ['OM', 'WAVE','MOMO' ,'FREE','MOOV'],
        default: 'OM'
    },

    dateTransactionSuccess: {
        type: String,
        default : ""
    },
  
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

module.exports = mongoose.model('deplacement', DeplacementModels) ;