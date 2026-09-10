/**
 * EventService — Public API for the Events feature
 * Delegates to EventApi (module-level HTTP layer)
 */

import { EventApi } from "../api/event.api";
import type { EventQueryParams } from "../types";
import type { EventFormData } from "../types";

export class EventService {
  static getEvents(params?: EventQueryParams) {
    return EventApi.getEvents(params);
  }

  static getEventById(id: string) {
    return EventApi.getEventById(id);
  }

  static createEvent(form: EventFormData) {
    return EventApi.createEvent({
      ...form,
      organizerId: "current-user-id", // Will be replaced by backend
      attendeesCount: 0,
    });
  }

  static updateEvent(id: string, updates: Partial<EventFormData>) {
    return EventApi.updateEvent(id, updates);
  }

  static deleteEvent(id: string) {
    return EventApi.deleteEvent(id);
  }
}