const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantModel = new Schema({

    service: {
        type : String,
    },

    idParent : {
        type: Schema.Types.ObjectId,
        ref: "user-admin"
    },

    nomEntreprise : {
        type: String,
        default :""
    },

    descriptionEntreprise : {
        type: String,
        default :""
    },

    telephone : {
        type: String,
        default :""
    },

    email : {
        type: String,
        default :""
    },

    photoCover : {
        type: Schema.Types.ObjectId,
        ref: "media",
    },

    gallerie : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default :[]
    }],


    notes : [{
        type: String,
        default :[]
    }],

    commentaires : [{
        type: String,
        default :[]
    }],

    plats : [{
        type: Schema.Types.ObjectId,
        ref :'plats',
        default :[]
    }],

    specialMenu : [{
        type: Schema.Types.ObjectId,
        ref :'special-menu',
        default :[]
    }],

    commodite : [{
        type: String,
        default :[]
    }],

   status : {
        type: String,
        default :"inactive"
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

module.exports = mongoose.model('restaurant', RestaurantModel) ;