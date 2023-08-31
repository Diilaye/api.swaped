const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BiensModel = new Schema({

    gallerie : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],

    prix : {
        type: String,
    },

    nom : {
        type: String,
    },

    descriptions : {
        type: String,
    },

    adresse : {
        type: String,
    },

    notes : [{
        type: String,
        default :[]
    }],

    commodites : [{
        type: String,
        default :[]
    }],

    reservations : [{
        type: String,
        default :[]
    }],
  
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

module.exports = mongoose.model('biens', BiensModel) ;