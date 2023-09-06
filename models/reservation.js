const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReservationModel = new Schema({


    bien : {
        type: Schema.Types.ObjectId,
        ref: "biens",
    },

    client: {
        type: Schema.Types.ObjectId,
        ref: "user-client",
    },

    dateDebut : {
        type: String,
    },

    dateFin : {
        type: String,
    },

    status: {
        type : String,
        enum: ['create','cancel-client' ,'accept-partenaire',"cancel-partenaire",'cancel-admin' , 'paiement' , 'waitingPayment'],
        default: 'create'
    },

    userCancel : {
        type: Schema.Types.ObjectId,
        ref: "user-admin'",
    },

    transaction : {
        type: Schema.Types.ObjectId,
        ref: "transactions'",
    },
    

    motifsCancel : {
        type: String,

    },

    isDisponible : {
        type: Boolean,
        default : true,
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

module.exports = mongoose.model('reservations', ReservationModel) ;