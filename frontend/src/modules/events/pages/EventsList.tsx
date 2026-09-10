/**
 * EventsList Page - Main events listing page
 * Follows the UserList architecture pattern with composed components and hooks
 */

import React, { useEffect, useCallback, useState } from "react";
import { Plus, Download, Calendar, CalendarDays, Clock } from "lucide-react";
import { useEventsStore } from "../store/events.store";
import { useEventFilters, useEventListPermissions } from "./EventsList/hooks";
import {
  EventsListHeader,
  EventStatsBar,
  PeriodTabs,
  EventBulkActionsBar,
  EventFiltersBar,
  EventTableWrapper,
  EventFormModal,
  DeleteEventModal,
} from "./EventsList/components";
import type { Event, EventFormData, EventStatus } from "../types";

type Period = "all" | "upcoming" | "ongoing" | "past";

export function EventsList() {
  const {
    events,
    pagination,
    loading,
    error,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    deleteEvents,
  } = useEventsStore();

  const permissions = useEventListPermissions();
  const filters = useEventFilters(pagination.pageSize);
  const [activePeriod, setActivePeriod] = useState<Period>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch events when filters change
  const fetchEvents = useCallback(async () => {
    await getEvents(filters.queryParams);
  }, [getEvents, filters.queryParams]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle period change - updates date range filter
  const handlePeriodChange = useCallback((period: Period) => {
    setActivePeriod(period);
    const today = new Date().toISOString().split("T")[0];
    
    switch (period) {
      case "upcoming":
        filters.setDateRange({ start: today, end: "" });
        break;
      case "ongoing":
        filters.setDateRange({ start: "", end: today });
        break;
      case "past":
        filters.setDateRange({ start: "", end: today });
        break;
      default:
        filters.setDateRange({ start: "", end: "" });
    }
    filters.setPage(1);
  }, [filters]);

  // Calculate period counts for tabs
  const periodCounts: Record<Period, number> = {
    all: events.length,
    upcoming: events.filter(e => new Date(e.startDate) > new Date()).length,
    ongoing: events.filter(e => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date()).length,
    past: events.filter(e => new Date(e.endDate) < new Date()).length,
  };

  // Selection handlers
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedIds(events.map(e => e.id));
    } else {
      setSelectedIds([]);
    }
  }, [events]);

  const handleSelectRow = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => selected ? [...prev, id] : prev.filter(i => i !== id));
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Bulk actions
  const handleBulkAction = useCallback(async (action: "delete" | "publish" | "draft" | "cancel") => {
    if (selectedIds.length === 0) return;
    
    setDeleteLoading(true);
    try {
      if (action === "delete") {
        await deleteEvents(selectedIds);
      } else {
        // For publish/draft/cancel, update each event
        const statusMap = { publish: "published", draft: "draft", cancel: "cancelled" } as const;
        const newStatus = statusMap[action];
        for (const id of selectedIds) {
          const event = events.find(e => e.id === id);
          if (event) {
            await updateEvent(id, { ...event, status: newStatus });
          }
        }
      }
      handleClearSelection();
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedIds, events, deleteEvents, updateEvent, handleClearSelection]);

  // CRUD operations
  const handleCreate = useCallback(() => {
    setEditingEvent(null);
    setShowFormModal(true);
  }, []);

  const handleEdit = useCallback((event: Event) => {
    setEditingEvent(event);
    setShowFormModal(true);
  }, []);

  const handleView = useCallback((event: Event) => {
    // Navigate to event detail page or open view modal
    console.log("View event:", event.id);
  }, []);

  const handleDelete = useCallback((event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setBulkDeleteCount(selectedIds.length);
    setShowDeleteModal(true);
  }, [selectedIds.length]);

  const handleFormSubmit = useCallback(async (data: EventFormData) => {
    setFormLoading(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await createEvent(data);
      }
      setShowFormModal(false);
      setEditingEvent(null);
    } finally {
      setFormLoading(false);
    }
  }, [editingEvent, createEvent, updateEvent]);

  const handleDeleteConfirm = useCallback(async () => {
    setDeleteLoading(true);
    try {
      if (eventToDelete) {
        await deleteEvent(eventToDelete.id);
      } else if (selectedIds.length > 0) {
        await deleteEvents(selectedIds);
        handleClearSelection();
      }
      setShowDeleteModal(false);
      setEventToDelete(null);
      setBulkDeleteCount(0);
    } finally {
      setDeleteLoading(false);
    }
  }, [eventToDelete, selectedIds, deleteEvent, deleteEvents, handleClearSelection]);

  const handleExport = useCallback(() => {
    // Export functionality
    console.log("Export events");
  }, []);

  if (!permissions.canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">You don't have permission to view events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <EventsListHeader
        permissions={permissions}
        onCreate={handleCreate}
        onExport={handleExport}
      />

      {/* Stats Bar */}
      <EventStatsBar events={events} />

      {/* Period Tabs */}
      <PeriodTabs
        activePeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        counts={periodCounts}
      />

      {/* Bulk Actions Bar */}
      <EventBulkActionsBar
        selectedIds={selectedIds}
        permissions={permissions}
        onAction={handleBulkAction}
        onClearSelection={handleClearSelection}
      />

      {/* Filters Bar */}
      <EventFiltersBar
        filters={filters}
        permissions={permissions}
      />

      {/* Table */}
      <EventTableWrapper
        events={events}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          totalPages: pagination.totalPages,
        }}
        loading={loading}
        permissions={permissions}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onPageChange={filters.setPage}
        onPageSizeChange={filters.setPageSize}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      <EventFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        initialData={editingEvent}
        mode={editingEvent ? "edit" : "create"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteEventModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
          setBulkDeleteCount(0);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        eventName={eventToDelete?.name}
        isBulk={!eventToDelete && selectedIds.length > 0}
        count={bulkDeleteCount}
      />
    </div>
  );
}