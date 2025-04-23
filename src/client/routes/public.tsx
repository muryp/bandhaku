import { type RouteObject } from "react-router";
import { Lazy } from "../utils/Lazy.tsx";
import NotFound from "../pages/NotFound.tsx";

const RoutesPublic: RouteObject[] = [
  {
    index: true,
    element: <Lazy component={() => import("../pages/Home.tsx")} />,
  },
  {
    path: "login",
    element: <Lazy component={() => import("../pages/Auth/Login.tsx")} />,
  },
  {
    path: "register",
    element: <Lazy component={() => import("../pages/Auth/Register.tsx")} />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
export default RoutesPublic;
