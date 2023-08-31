const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentaireModel = new Schema({

texte: String,
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur' // Référence à un modèle Utilisateur
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

module.exports = mongoose.model('commentaires', commentaireModel) ;