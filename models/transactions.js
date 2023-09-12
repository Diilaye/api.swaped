const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionModel = new Schema({
    
    reference: {
        type: String 
    },

    amount : {
        type : String
    },

    justificatif : {
        type : Schema.Types.ObjectId
    },


    token : {
        type : String,
        unique : true
    },

    client : {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    service : {
        type : String,
        defult :""
    },

    
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS','CANCELED'],
        default: 'PENDING'
    },

    typeService: {
        type: String,
        enum: ['LOGEMENT', 'RESTAURANT','VOITURE','MOTO'],
        default: 'LOGEMENT'
    },

    type: {
        type: String,
        enum: ['OM', 'PAYPAL','MOMO','DEALLY'],
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

module.exports = mongoose.model('transactions', transactionModel);