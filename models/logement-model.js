const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogementModel = new Schema({

    service: {
        type : String,
    },

    pays: {
        type : String,
        enum: ['gn','ci','sn'],
        default: 'gn'
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

    biens : [{
        type: Schema.Types.ObjectId,
        ref :'biens',
        default :[]
    }],

   status : {
        type: String,
        default :"inactive"
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

module.exports = mongoose.model('logement', LogementModel) ;