const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'rescuer', 'user'], default: 'user' },
  address: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  googleId: { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
