import api from './axios';

export const uploadDocuments = async (files, onUploadProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return res.data;
};

export const getDocuments = async () => {
  const res = await api.get('/upload');
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await api.delete(`/upload/${id}`);
  return res.data;
};
