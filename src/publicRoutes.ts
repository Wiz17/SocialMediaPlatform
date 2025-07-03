import Login from "./pages/login.tsx";
import Signup from "./pages/signup.tsx";
import CreateUser from "./pages/createUser.tsx";
const PublicRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/createuser",
    component: CreateUser,
  },
];

export default PublicRoutes;
