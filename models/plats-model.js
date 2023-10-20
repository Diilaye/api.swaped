
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlatsModel = new Schema({

    galery : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],

    specialite : {
        type : String,
        default :"Africaine"
    },

    menu : {
        type : Array,
        default :[]
    },

    pays: {
        type : String,
        enum: ['gn','ci','sn'],
        default: 'gn'
    },

    idRestaurant : {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
    },

    
    titre : {
        type: String,
    },

    complements : {
        type: Array,
        default :[]
    },

    
    description : {
        type: String,
    },

    tarif  : {
        type: Number,
    },

    commandes : [{
        type: Schema.Types.ObjectId,
        ref: "commandes",
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

    isDisponible : {
        type: Boolean,
        default : true,
    },

    isLivrable : {
        type: Boolean,
        default : true,
    },
    
    isFreeLivraison : {
        type: Boolean,
        default : false,
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

module.exports = mongoose.model('plats', PlatsModel) ;