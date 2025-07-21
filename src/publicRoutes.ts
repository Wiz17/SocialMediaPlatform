import { lazy } from "react";

const Login = lazy(() => import("./pages/login.tsx"));
const Signup = lazy(() => import("./pages/signup.tsx"));
const CreateUser = lazy(() => import("./pages/createUser.tsx"));

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
