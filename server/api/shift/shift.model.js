'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShiftSchema = new Schema({
  nom: String,
  description: String,
  createdOn: {
    type: Date,
    default: new Date()
  },
  remarques: String,
  debut : Date,
  fin: Date,
  coursiers : [{ type: Schema.ObjectId, ref: 'User' }],
  ville : String,
  jours : [],
  competences : [],
  periodeIn : String,
  periodeOut: String
});

module.exports = mongoose.model('Shift', ShiftSchema);