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

    date: {
        type: Date,
        default: Date.now()
    }

},{
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.statusConexion;
        delete ret.__v;
      },
    },
},{
    timestamps: true 
});

module.exports = mongoose.model('user-client', ClientModels) ;