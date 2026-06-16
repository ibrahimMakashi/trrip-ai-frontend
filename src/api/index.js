import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getDashboard: () => api.get('/auth/dashboard'),
};

export const uploadAPI = {
  uploadFiles: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  },
};

export const itineraryAPI = {
  generate: (documentIds) => api.post('/itinerary/generate', { documentIds }),
  getAll: (params) => api.get('/itinerary', { params }),
  getById: (id) => api.get(`/itinerary/${id}`),
  delete: (id) => api.delete(`/itinerary/${id}`),
};

export const shareAPI = {
  createShareLink: (id) => api.post(`/share/${id}`),
  getShared: (shareId) => api.get(`/share/${shareId}`),
};
