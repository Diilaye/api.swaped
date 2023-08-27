const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminModels = new Schema({

    service: {
        type : String,
        enum: ['restaurant','logement' ,"admin",'commercial'],
        default: 'logement'
    },

    nom : {
        type: String,
        default :""
    },

    prenom : {
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

    identifiant : {
        type: String,
        require : true,
        unique : true
    },

    password : {
        type: String,
        default :""
    },

    photoProfile : {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

   statusConexion : {
        type: String,
        default :"inactive"
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
},);

module.exports = mongoose.model('user-admin', AdminModels) ;