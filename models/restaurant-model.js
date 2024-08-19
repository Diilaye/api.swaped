const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantModel = new Schema({

    service: {
        type : String,
    },

    pays: {
        type : String,
        enum: ['gn','ci','sn'],
        default: 'gn'
    },

    typePartenaire: {
        type : String,
        enum: ['0','1'],
        default: '0'
    },

    specialite : {
        type : Array,
        default : []
    },

    adresse : {
        type: String,
        default :""
    },

    localisation : {
        type: Map,
        default : {
            lat : 0.0,
            lng :0.0
        }
    },

    heureOuverture : {
        type: String,
        default :""
    },

    heureFermeture : {
        type: String,
        default :""
    },

    jourOuvertures : {
        type : Array,
        default : []
    },

    nombreTable : {
        type : String,
        default : "1"
    },


    idParent : {
        type: Schema.Types.ObjectId,
        ref: "user-admin"
    },

    nomEntreprise : {
        type: String,
        default :""
    },

    descriptionEntreprise : {
        type: String,
        default :""
    },

    telephone : {
        type: String,
        default :""
    },

    telephone1 : {
        type: String,
        default :""
    },

    telephone2 : {
        type: String,
        default :""
    },

    email : {
        type: String,
        default :""
    },

    photoCover : {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    gallerie : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],


    notes : [{
        type: String,
        default :[]
    }],

    commentaires : [{
        type: String,
        default :[]
    }],

    plats : [{
        type: Schema.Types.ObjectId,
        ref :'plats',
        default :[]
    }],

    specialMenu : [{
        type: Schema.Types.ObjectId,
        ref :'special-menu',
        default :[]
    }],

    commodite : [{
        type: String,
        default :[]
    }],

   status : {
        type: String,
        default :"active"
   },

   zone : {
    type: Schema.Types.ObjectId,
    ref :'zones',
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

module.exports = mongoose.model('restaurant', RestaurantModel) ;