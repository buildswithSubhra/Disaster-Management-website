const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateId = () => {
  return uuidv4();
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  generateId,
  JWT_SECRET
};
