import api from '../api/axios';

export const getRoutes = async () => {
  const response = await api.get('/trips/routes');
  return response.data;
};

export const getVehicles = async (routeId) => {
  const response = await api.get('/trips/vehicles', {
    params: routeId ? { routeId } : {},
  });
  return response.data;
};

export const createTrip = async (payload) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/trips', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

export const updateTrip = async (tripId, payload) => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/trips/${tripId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTrip = async (tripId) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/trips/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
