import * as React from "react";
import { useParams, useNavigate, type RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { EventsList } from "@/modules/events/pages/EventsList";

/**
 * Events Route Helpers
 */
export const eventsRoutesConfig = {
  list: () => "/events",
  create: () => "/events/new",
  details: (id: string) => `/events/${id}`,
  edit: (id: string) => `/events/${id}/edit`,
};

const EventsListRoute: React.FC = () => {
  return <EventsList />;
};

/**
 * Events Feature Routes
 */
export const eventsRoutes: RouteObject[] = [
  {
    path: "events",
    element: <PermissionGuard permission="pages.events" />,
    children: [
      { index: true, element: <EventsListRoute /> },
      // { path: "new", element: <EventFormRoute /> },
      // { path: ":id/edit", element: <EventFormRoute /> },
      // { path: ":id", element: <EventDetailsRoute /> },
    ],
  },
];