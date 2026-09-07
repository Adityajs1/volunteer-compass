import apiClient from './client';

export const getEventsApi = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return apiClient.get(`/events?${queryParams}`);
};

export const getEventApi = async (id) => {
  return apiClient.get(`/events/${id}`);
};

export const createEventApi = async (data) => {
  return apiClient.post('/events', data);
};

export const rsvpApi = async (payload) => {
  const eventId = typeof payload === 'object' ? payload.eventId : payload;
  return apiClient.post('/rsvps', { eventId });
};

export const leaveRsvpApi = async (rsvpId) => {
  // If we had a delete endpoint: return apiClient.delete(`/rsvps/${rsvpId}`);
  // As per current API, update status to CANCELLED
  return apiClient.put(`/rsvps/${rsvpId}/status`, { status: 'CANCELLED' });
};
