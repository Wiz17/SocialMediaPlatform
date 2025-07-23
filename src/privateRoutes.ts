import { lazy } from "react";

const Home = lazy(() => import("./pages/home/home.tsx"));
const Notifications = lazy(() => import("./pages/notifications.tsx"));
const Updates = lazy(() => import("./pages/updates.tsx"));
const CreateUser = lazy(() => import("./pages/createUser.tsx"));

const PrivateRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/updates",
    component: Updates,
  },
  {
    path: "/createuser",
    component: CreateUser,
  },
];

export default PrivateRoutes;
