
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SpecialMenu = new Schema({

    galery : {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    idRestaurant : {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
    },

    pays: {
        type : String,
        enum: ['gn','ci','sn'],
        default: 'gn'
    },
    
    titre : {
        type: String,
    },

    complements : {
        type: Array,
        default :[]
    },

    dateDebut : {
        type : Date
    },

    dateFin : {
        type : Date
    },

    pourcentage  : {
        type: Number,
    },

    plats : [{
        type: Schema.Types.ObjectId,
        ref: "plats",
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