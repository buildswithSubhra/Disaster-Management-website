const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Building Collapse', 'Road Accident']
  },
  description: { type: String, default: '' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  address: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'], default: 'Pending' },
  assignedRescuer: { type: mongoose.Schema.Types.ObjectId, ref: 'Rescuer', default: null },
  peopleAffected: { type: Number, default: 0 },
  emergencyContact: { type: String, default: '' }
}, { timestamps: true });

disasterSchema.index({ userId: 1, createdAt: -1 });
disasterSchema.index({ status: 1 });
disasterSchema.index({ type: 1 });
disasterSchema.index({ assignedRescuer: 1 });

const Disaster = mongoose.model('Disaster', disasterSchema);

module.exports = Disaster;
