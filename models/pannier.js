const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const Pannier = new Schema({
    
    quantity : {
        type : Number,
        default : 1
    },

    plat : {
        type: Schema.Types.ObjectId,
        ref: "plats",
    },

    restaurant : {
        type: Schema.Types.ObjectId,
        ref: "restaurant",
    },

    client : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    complements : {
        type: Array,
        default :[]
    },
  
    prix_total : {
        type : Number
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

module.exports = mongoose.model('pannier', Pannier);