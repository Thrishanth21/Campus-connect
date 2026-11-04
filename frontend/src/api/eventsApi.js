import { getAccessToken, supabase } from './supabaseClient';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  let accessToken = null;
  try {
    accessToken = await getAccessToken();
  } catch (authError) {
    const error = new Error(`Could not read your Supabase session: ${authError.message}`);
    error.status = 401;
    throw error;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    const error = new Error('Cannot reach the Campus Connect API. Start the Flask server and check VITE_API_BASE_URL.');
    error.status = 0;
    throw error;
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || `API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return { status: response.status, data: body };
}

const value = (row, ...keys) => keys.map((key) => row?.[key]).find((item) => item !== undefined && item !== null);
function mapEvent(row) {
  return {
    ...row,
    id: value(row, 'id'),
    title: value(row, 'title', 'name') || 'Campus Event',
    tagline: value(row, 'tagline') || '',
    category: value(row, 'category') || 'Campus',
    date: value(row, 'date', 'event_date') || '',
    time: value(row, 'time', 'event_time') || '',
    location: value(row, 'location', 'venue') || '',
    building: value(row, 'building') || '',
    organizerId: value(row, 'organizerId', 'organizer_id', 'user_id'),
    organizerName: value(row, 'organizerName', 'organizer_name') || 'Campus Organizer',
    organizerRole: value(row, 'organizerRole', 'organizer_role') || 'Organizer',
    capacity: Number(value(row, 'capacity', 'max_attendees')) || 0,
    registeredCount: 0,
    spotsRemaining: Number(value(row, 'capacity', 'max_attendees')) || 0,
    isRegistered: false,
    isOrganizer: false,
    description: value(row, 'description') || '',
    prerequisites: value(row, 'prerequisites') || '',
    schedule: value(row, 'schedule') || [],
    accentColor: value(row, 'accentColor', 'accent_color') || '#2563EB',
    tags: value(row, 'tags') || [],
  };
}

function mapRegistration(row) {
  return {
    ...row,
    id: value(row, 'id'),
    eventId: value(row, 'eventId', 'event_id'),
    userId: value(row, 'userId', 'user_id'),
    userName: value(row, 'userName', 'user_name') || '',
    userEmail: value(row, 'userEmail', 'user_email') || '',
    registeredAt: value(row, 'registeredAt', 'registered_at') || '',
    status: value(row, 'status') || 'CONFIRMED',
    ticketCode: value(row, 'ticketCode', 'ticket_code') || '',
    eventTitle: value(row, 'eventTitle', 'event_title') || '',
    eventDate: value(row, 'eventDate', 'event_date') || '',
    eventTime: value(row, 'eventTime', 'event_time') || '',
    eventLocation: value(row, 'eventLocation', 'event_location') || '',
  };
}

async function getAuthenticatedUserId() {
  if (!supabase) {
    const error = new Error('Set the Supabase frontend URL and publishable key in frontend/.env.');
    error.status = 503;
    throw error;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const authError = new Error('Sign in with your Supabase account to use this feature.');
    authError.status = 401;
    throw authError;
  }
  return data.user.id;
}

export const campusApi = {
  async getEvents({ search = '', category = 'All', filter = 'all' } = {}) {
    const [result, registrationsResult] = await Promise.all([
      request('/api/events'),
      request('/api/me/registrations'),
    ]);
    const userId = await getAuthenticatedUserId();
    const registrations = (Array.isArray(registrationsResult.data) ? registrationsResult.data : []).map(mapRegistration);
    const registeredIds = new Set(registrations.map((registration) => String(registration.eventId)));
    let events = (Array.isArray(result.data) ? result.data : []).map((row) => {
      const event = mapEvent(row);
      return {
        ...event,
        isRegistered: registeredIds.has(String(event.id)),
        isOrganizer: String(event.organizerId) === String(userId),
        myRegistration: registrations.find((registration) => String(registration.eventId) === String(event.id)) || null,
      };
    });
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      events = events.filter((event) => [event.title, event.description, event.location, event.category, ...(event.tags || [])].some((text) => String(text || '').toLowerCase().includes(query)));
    }
    if (category && category !== 'All') events = events.filter((event) => event.category.toLowerCase() === category.toLowerCase());
    if (filter === 'registered') events = events.filter((event) => event.isRegistered);
    if (filter === 'organized') events = events.filter((event) => event.isOrganizer);
    return { status: result.status, data: events };
  },

  async getEventById(id) {
    const [result, registrationsResult] = await Promise.all([
      request(`/api/events/${encodeURIComponent(id)}`),
      request('/api/me/registrations'),
    ]);
    const event = mapEvent(result.data);
    const registrations = (Array.isArray(registrationsResult.data) ? registrationsResult.data : []).map(mapRegistration);
    event.myRegistration = registrations.find((registration) => String(registration.eventId) === String(event.id)) || null;
    event.isRegistered = Boolean(event.myRegistration);
    event.isOrganizer = String(event.organizerId) === String(await getAuthenticatedUserId());
    return { status: result.status, data: event };
  },

  async createRegistration({ eventId }) {
    const result = await request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId }),
    });
    return { ...result, data: mapRegistration(result.data) };
  },

  async getMyRegistrations() {
    const [result, eventResult] = await Promise.all([
      request('/api/me/registrations'),
      request('/api/events'),
    ]);
    const eventsById = new Map((Array.isArray(eventResult.data) ? eventResult.data : []).map((row) => {
      const event = mapEvent(row);
      return [String(event.id), event];
    }));
    const registrations = (Array.isArray(result.data) ? result.data : []).map((row) => {
      const registration = mapRegistration(row);
      const event = eventsById.get(String(registration.eventId));
      return {
        ...registration,
        event: event || {
          title: registration.eventTitle || 'Campus Event',
          date: registration.eventDate,
          time: registration.eventTime,
          location: registration.eventLocation,
          category: 'Campus',
        },
      };
    });
    return { status: result.status, data: registrations };
  },

  async getEventAttendees(eventId) {
    const [result, eventResult] = await Promise.all([
      request(`/api/events/${encodeURIComponent(eventId)}/registrations`),
      request(`/api/events/${encodeURIComponent(eventId)}`),
    ]);
    const attendees = (Array.isArray(result.data) ? result.data : []).map(mapRegistration);
    const event = mapEvent(eventResult.data);
    return { status: result.status, data: { eventId, eventTitle: event.title, capacity: event.capacity, attendees, registeredCount: attendees.length } };
  },

  async createEvent(eventData) {
    const result = await request('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: eventData.title,
        tagline: eventData.tagline,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        building: eventData.building,
        capacity: Number(eventData.capacity),
        description: eventData.description,
        prerequisites: eventData.prerequisites,
        accent_color: eventData.accentColor,
        schedule: eventData.schedule || [],
        tags: eventData.tags || [eventData.category, 'Campus'],
      }),
    });
    return { ...result, data: mapEvent(result.data) };
  },

  async cancelRegistration() {
    const error = new Error('Cancellation is not available yet: the Flask API does not implement DELETE /api/registrations/{id}.');
    error.status = 501;
    throw error;
  },
};
