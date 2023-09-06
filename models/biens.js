const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BiensModel = new Schema({

    adresse : {
        type: String,
    },

    galery : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],

    typeLogement : {
        type: String,
    },

    titre : {
        type: String,
    },

    
    description : {
        type: String,
    },

    nbreChambre : {
        type: Number,
    },

    nbreVoyageur : {
        type: Number,
    },

    nbreSalleBain : {
        type: Number,
    },

    commoditeChambre : [{
        type: String,
        default :[]
    }],

    commoditeSalon : [{
        type: String,
        default :[]
    }],

    commoditeCuisine : [{
        type: String,
        default :[]
    }],

    commoditeSalleBain : [{
        type: String,
        default :[]
    }],

    commoditeBuanderie : [{
        type: String,
        default :[]
    }],

    commoditeJardin : [{
        type: String,
        default :[]
    }],

    commoditeServiceAnnexe : [{
        type: String,
        default :[]
    }],

    nbreMinNuit  : {
        type: Number,
    },

    tarif  : {
        type: Number,
    },

    tarifLocataireSupplementaire  : {
        type: Number,
    },

    tarif_menagere  : {
        type: Number,
    },

    reservations : [{
        type: String,
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

module.exports = mongoose.model('biens', BiensModel) ;