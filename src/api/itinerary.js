import api from './axios';

export const generateItinerary = async (documentIds) => {
  const res = await api.post('/itinerary/generate', { documentIds });
  return res.data;
};

export const getItineraries = async (params = {}) => {
  const res = await api.get('/itinerary', { params });
  return res.data;
};

export const getItinerary = async (id) => {
  const res = await api.get(`/itinerary/${id}`);
  return res.data;
};

export const deleteItinerary = async (id) => {
  const res = await api.delete(`/itinerary/${id}`);
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await api.get('/itinerary/stats');
  return res.data;
};

export const shareItinerary = async (id) => {
  const res = await api.post(`/share/${id}`);
  return res.data;
};

export const getSharedItinerary = async (shareId) => {
  const res = await api.get(`/share/${shareId}`);
  return res.data;
};
