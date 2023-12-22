const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminModels = new Schema({

    service: {
        type : String,
        enum: ['restaurant','logement' ,"admin",'commercial',"mobilite"],
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

    telephoneOM : {
        type: String,
        default :""
    },

    telephoneMOMO : {
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

    idPartenaire : {
        type: Schema.Types.ObjectId,
        ref: "partenaires",
    },

   statusConexion : {
        type: String,
        default :"inactive"
   },

   conditionAnulation : {
    type: Array,
    default : [
        {"pourcantage" : "100" , "jour" : "30"},
        {"pourcantage" : "70" , "jour" : "15"},
        {"pourcantage" : "0" , "jour" : "2"},
    ]
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

module.exports = mongoose.model('user-admin', AdminModels) ;