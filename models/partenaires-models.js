const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PartenaireModels = new Schema({

    service: {
        type : String,
        enum: ['restaurant','logement','mobilite'],
        default: 'logement'
    },

    pays: {
        type : String,
        enum: ['gn','ci','sn'],
        default: 'gn'
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

    
    status : {
        type : String,
        enum: ['inactive','active','canceled'],
        default: 'inactive'
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
},);

module.exports = mongoose.model('partenaires', PartenaireModels) ;