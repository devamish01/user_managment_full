import * as React from "react";
import { useParams, useNavigate, type RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { UserList } from "@/modules/users/components/UserList";
import { UserDetails } from "@/modules/users/components/UserDetails";
import { UserForm } from "@/modules/users/components/UserForm";

/**
 * User Route Helpers
 */
export const userRoutesConfig = {
  list: () => "/users",
  create: () => "/users/new",
  details: (id: string) => `/users/${id}`,
  edit: (id: string) => `/users/${id}/edit`,
};

const UserDetailsRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;
  return <UserDetails id={id} onBack={() => navigate(userRoutesConfig.list())} />;
};

const UserFormRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <UserForm id={id} onCancel={() => navigate(userRoutesConfig.list())} />;
};

/**
 * Users Feature Routes
 */
export const usersRoutes: RouteObject[] = [
  {
    path: "users",
    element: <PermissionGuard permission="pages.users" />,
    children: [
      { index: true, element: <UserList /> },
      { path: "new", element: <UserFormRoute /> },
      { path: ":id/edit", element: <UserFormRoute /> },
      { path: ":id", element: <UserDetailsRoute /> },
    ],
  },
];
