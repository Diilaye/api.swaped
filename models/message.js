const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageModel = new Schema({

    reservations : {
        type: Schema.Types.ObjectId,
        ref: "reservations",
    },

    text : {
        type: String,
        default :""
    },

    statusSender: {
        type : String,
        enum: ['client','partenaire' ,'admin'],
        default: 'client'
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

module.exports = mongoose.model('messages', MessageModel) ;