/**
 * Events Module Types
 */

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  category: EventCategory;
  capacity: number;
  attendeesCount: number;
  organizerId: string;
  organizerName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export type EventCategory = "conference" | "workshop" | "meetup" | "webinar" | "social" | "other";

export interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  category: EventCategory;
  capacity: number;
  isPublic: boolean;
}

export interface EventQueryParams {
  search?: string;
  status?: EventStatus;
  category?: EventCategory;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}