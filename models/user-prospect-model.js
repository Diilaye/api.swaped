const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProspectModel = new Schema({

    nomComplet : {
        type: String,
        default :""
    },

    telephone : {
        type: String,
        default :""
    },

    type : {
        type: String,
        enum: ['prospect', 'client'],
        default: 'prospect'
    },

    typeService : {
        type: String,
        enum: ['logements', 'restaurations','taxi-moto','voiture'],
        default: 'logements'
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

module.exports = mongoose.model('user-prospect', ProspectModel) ;