const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const PannierCommande = new Schema({
    
    reference: {
        type: String ,
        unique : true,

    },

    quantity : {
        type : Number,
        default : 1
    },

    plat : {
        type: Schema.Types.ObjectId,
        ref: "plats",
    },

    restaurant : {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
    },

    client : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    prix_total : {
        type : Number
    },

    prix_offre : {
        type : Number
    },

    prix_livraison : {
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
   
      
    statusLivraison: {
        type: String,
        enum: ['emporter', 'livraison'],
        default: 'livraison'
    },

    creneaux: {
        type : String,
        enum: ['30','60','120'],
        default: '30'
    },
    
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS','CANCELED'],
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

module.exports = mongoose.model('pannier-commande', PannierCommande);