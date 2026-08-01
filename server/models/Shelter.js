const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  capacity: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    address: { type: String, default: '' }
  },
  contact: { type: String, default: '' }
}, { timestamps: true });

shelterSchema.index({ 'location.lat': 1, 'location.lng': 1 });

const Shelter = mongoose.model('Shelter', shelterSchema);

module.exports = Shelter;
