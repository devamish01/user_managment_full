import type { RouteObject } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { HomePage } from "./HomePage";

export const homeRoutes: RouteObject[] = [
  // Public home route - accessible without authentication
  {
    element: <PublicLayout />,
    children: [
      { path: "home", element: <HomePage /> },
    ],
  },
];

export default homeRoutes;