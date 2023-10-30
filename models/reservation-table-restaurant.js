const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservationRestaurantModel = new Schema({

    date : {
        type: Date,
    },


    nombrePersonne : {
        type : Number,
        default : 2
    },


    restaurants : {
        type: Schema.Types.ObjectId,
        ref: "restaurant"
    },

    client : {
        type: Schema.Types.ObjectId,
        ref :"user-client"
    },

   creneaux : {
        type: String,
        default :"active"
    },  

   statusRes : {
        type: String,
        default :"active"
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

module.exports = mongoose.model('reservation-restaurant', reservationRestaurantModel) ;