const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClientModels = new Schema({

    nom : {
        type: String,
        default :""
    },

    prenom : {
        type: String,
        default :""
    },

    sexe : {
        type: String,
        enum: ['homme', 'femme'],
        default: 'homme'
    },

    telephoneMOMO : {
        type: String,
    },

    telephoneOM : {
        type: String,
    },

    email : {
        type: String,
        default :""
    },

    password : {
        type: String,
        default :""
    },

    photoProfile : {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

   statusCompte : {
        type: String,
        default :"active"
   },
  
   token : {
    type: String,
   },

},{
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.statusCompte;
        delete ret.__v;
      },
    },
},{
    timestamps: true 
});

module.exports = mongoose.model('user-client', ClientModels) ;