const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoursesModel = new Schema({

    client : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    transaction : {
        type: Schema.Types.ObjectId,
        ref: "wallet-transactions",
        default : null
    },

    mobilite : {
        type: Schema.Types.ObjectId,
        ref: "mobilite",
        default : null
    },

    commande : {
        type: Schema.Types.ObjectId,
        ref: "pannier-commande",
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

    distance : {
        type : Map,
        default : {
            text: "", 
            value: 0
        }
    },

    duree : {
        type : Map,
        default : {
            text: "", 
            value: 0
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
        default: 'deplacement'
    },

    statusLivraisonVehicule: {
        type: String,
        enum: ['moto', 'confort' ,'standard'],
        default: 'moto'
    },

    statusCourses: {
        type: String,
        enum: ['pending', 'pending-chauffeur','accept-chauffeur','cancel-chauffeur','cancel-client' ,'success','start-course','paiement-client','cancel-server'],
        default: 'pending'
    },

    courseCancelRaison : [{
        type: String,
        default: [] 

    }],

    notes : [{
        type: Number,
        default: [5]

    }],

    statusDate : {
        type: String,
        enum: ['now', 'after'],
        default: 'now'
    },

    dateCourses : {
        type : String,
        default : ''
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

module.exports = mongoose.model('courses-model', CoursesModel) ;