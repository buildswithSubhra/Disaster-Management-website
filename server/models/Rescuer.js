const mongoose = require('mongoose');

const rescuerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  availability: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
  skills: [{ type: String }],
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disaster' }]
}, { timestamps: true });

const Rescuer = mongoose.model('Rescuer', rescuerSchema);

module.exports = Rescuer;
