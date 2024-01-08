const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const walletTransactionModel = new Schema({
    
    reference: {
        type: String ,
        unique : true,

    },

    amount : {
        type : String
    },


    userWallet : {
        type: Schema.Types.ObjectId,
        ref: "wallet"
    },

    
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS','CANCELED'],
        default: 'PENDING'
    },

    typeService: {
        type: String,
        enum: ['recharge', 'retrait'],
        default: 'recharge'
    },

    means: {
        type: String,
        enum: ['OM', 'SWAPED','MOMO','WAVE','MOOV'],
        default: 'OM'
    },

    dateTransactionSuccess: {
        type: String,
        default : ""
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

module.exports = mongoose.model('wallet-transactions', walletTransactionModel);