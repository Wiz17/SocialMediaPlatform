import Home from "./pages/home/home.tsx";
import Notifications from "./pages/notifications.tsx";
import Updates from "./pages/updates.tsx";

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
];
export default PrivateRoutes;
