const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoursesModel = new Schema({

    client : {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    mobilite : {
        type: Schema.Types.ObjectId,
        ref: "user-admin",
        default : null
    },

    prix_total : {
        type : Number
    },

    prix_offre : {
        type : Number
    },    

    pointDepart : {
        type : Map,
        default : {
            lat: 0,
            lng:0
        }
    },

    pointArrive : {
        type : Map,
        default : {
            lat: 0,
            lng:0
        }
    },

    addresseDepart : {
        type : String,
        default : ''
    },

    addresseArrive : {
        type : String,
        default : ''
    },

    statusLivraison: {
        type: String,
        enum: ['deplacement', 'livraison'],
        default: 'livraison'
    },

    statusDate : {
        type: String,
        enum: ['now', 'after'],
        default: 'now'
    },

    dateCourses : {
        type : String,
        default : ''
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

module.exports = mongoose.model('courses-model', CoursesModel) ;