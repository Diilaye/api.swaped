const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const reclamationModel = new Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  typeService : {
    type: String,
    enum: ['mobilite', 'restaurant','logement'],
    default: 'mobilite'
  },

  type : {
    type: String,
    enum: ['admin', 'server','client'],
    default: 'client'
  },

  obect : {
    type : Map , 
    default : {}
  },

  ticketReclamation : {
    type : String , 
    unique : true,
  },

  probleme : {
    type : String,
    default : ''
  },

  solution : {
    type : String,
    default : ''
  },

  statusReclamation : {
    type: String,
    enum: ['pending', 'call-client','finish'],
    default: 'pending'
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

module.exports = mongoose.model('reclamations', reclamationModel) ;