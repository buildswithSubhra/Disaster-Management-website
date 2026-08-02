export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};
