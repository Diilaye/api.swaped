
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SpecialMenu = new Schema({

    galery : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],

    idRestaurant : {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
    },

    
    titre : {
        type: String,
    },

    complements : [{
        type: Map,
        default :[]
    }],

    dateFin : {
        type : Date
    },

    
    description : {
        type: String,
    },

    pourcentage  : {
        type: Number,
    },

    plats : [{
        type: Schema.Types.ObjectId,
        ref: "plats",
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

    isLivraible : {
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

module.exports = mongoose.model('special-menu', SpecialMenu) ;