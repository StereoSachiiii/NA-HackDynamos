// Using Cloudinary for image uploads (most reliable and easy)
// Alternative: You can use the backend endpoint /api/v1/logs/photo for base64 uploads

import api from './api';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

export const uploadImage = async (file) => {
  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
    // Fallback to backend endpoint if Cloudinary not configured
    return uploadToBackend(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return uploadToBackend(file);
  }
};

const uploadToBackend = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const response = await api.post('/logs/photo', { base64 });
        resolve({
          success: true,
          url: response.data.data.photoUrl,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
};

