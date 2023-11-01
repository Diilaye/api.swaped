const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const walletModel = new Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  typeWallet : {
    type: String,
    enum: ['client', 'admin',],
    default: 'client'
  },

  phoneWallet : {
    type : String , 
  },

  idWallet : {
    type : String , 
    unique : true,
  },

  balance : {type : Number , default :0},

  

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

module.exports = mongoose.model('wallet', walletModel) ;