/**
 * events.store.ts
 * Zustand store for the Events module
 */

import { create } from "zustand";
import type { Event, EventQueryParams } from "../types";
import { EventService } from "../services/event.service";
import type { Pagination } from "@/api";

const defaultPagination: Pagination = {
  page: 1,
  pageSize: 10,
  totalPages: 0,
};

interface EventsState {
  events: Event[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
}

interface EventsActions {
  getEvents: (params?: EventQueryParams) => Promise<void>;
  getEventById: (id: string) => Promise<void>;
  createEvent: (data: Event) => Promise<void>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  deleteEvents: (ids: string[]) => Promise<void>;
  setSelectedEvent: (event: Event | null) => void;
  reset: () => void;
}

export type EventsStore = EventsState & EventsActions;

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  pagination: defaultPagination,
  loading: false,
  error: null,
  selectedEvent: null,

  getEvents: async (params?: EventQueryParams) => {
    set({ loading: true, error: null });

    try {
      const response = await EventService.getEvents(params);
      if (!response.success) {
        throw new Error(response.message || "Failed to load events");
      }

      set({
        events: response.data ?? [],
        pagination: (response.meta as Pagination) ?? defaultPagination,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load events",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getEventById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await EventService.getEventById(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to load event");
      }

      set({ selectedEvent: response.data ?? null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load event",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (data: Event) => {
    set({ loading: true, error: null });

    try {
      const response = await EventService.createEvent(data);
      if (!response.success) {
        throw new Error(response.message || "Failed to create event");
      }

      await get().getEvents();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create event",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEvent: async (id: string, data: Partial<Event>) => {
    set({ loading: true, error: null });

    try {
      const response = await EventService.updateEvent(id, data);
      if (!response.success) {
        throw new Error(response.message || "Failed to update event");
      }

      await get().getEvents();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update event",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await EventService.deleteEvent(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete event");
      }

      await get().getEvents();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete event",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEvents: async (ids: string[]) => {
    set({ loading: true, error: null });

    try {
      for (const id of ids) {
        const response = await EventService.deleteEvent(id);
        if (!response.success) {
          throw new Error(response.message || `Failed to delete event ${id}`);
        }
      }
      await get().getEvents();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete events",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setSelectedEvent: (event: Event | null) => {
    set({ selectedEvent: event });
  },

  reset: () => {
    set({
      events: [],
      pagination: defaultPagination,
      loading: false,
      error: null,
      selectedEvent: null,
    });
  },
}));