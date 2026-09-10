/**
 * Events Module API Endpoints
 */

export const EVENTS = "/events";
export const EVENT_DETAILS = (id: string) => `/events/${id}`;
export const EVENT_ATTENDEES = (id: string) => `/events/${id}/attendees`;