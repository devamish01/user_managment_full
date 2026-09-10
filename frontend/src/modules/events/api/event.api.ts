/**
 * Events Module API Layer
 * Thin HTTP wrapper around core/api/client
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { Event, EventQueryParams } from "../types";
import { EVENTS, EVENT_DETAILS } from "./event.endpoints";

export class EventApi {
  static getEvents(params?: EventQueryParams): Promise<ApiResponse<Event[]>> {
    return api.get<Event[]>(EVENTS, { params });
  }

  static getEventById(id: string): Promise<ApiResponse<Event>> {
    return api.get<Event>(EVENT_DETAILS(id));
  }

  static createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt" | "currentAttendees" | "organizerName">): Promise<ApiResponse<Event>> {
    return api.post<Event>(EVENTS, event);
  }

  static updateEvent(id: string, updates: Partial<Event>): Promise<ApiResponse<Event>> {
    return api.patch<Event>(EVENT_DETAILS(id), updates);
  }

  static deleteEvent(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return api.delete<{ ok: boolean }>(EVENT_DETAILS(id));
  }
}