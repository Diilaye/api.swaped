const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PartenaireModels = new Schema({

    service: {
        type : String,
        enum: ['restaurant','hotel','mobilite'],
        default: 'hotel'
    },

    nomEntreprise : {
        type: String,
        default :""
    },

    descriptionEntreprise : {
        type: String,
        default :""
    },

    nomInterlocuteur : {
        type: String,
        default :""
    },

    prenomInterlocuteur : {
        type: String,
        default :""
    },
    
    telephoneInterlocuteur : {
        type: String,
        default :""
    },

    photoExterieur : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default : []
    }],

    photoInterne : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default : []

    }],

    localisation : {
        type: String,
        default :""
    },

    dateRv : {
        type: String,
        default :""
    },

    heureRv : {
        type: String,
        default :""
    },

    
    date: {
        type: Date,
        default: Date.now()
    }

},{
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete  ret.token;
        delete ret.__v;
      },
    },
  },);

module.exports = mongoose.model('partenaires', PartenaireModels) ;