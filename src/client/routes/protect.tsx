import { type RouteObject } from "react-router";
import LayoutProtect from "../layouts/protect.tsx";
import { Lazy } from "../utils/Lazy.tsx";


const RoutesProtect: RouteObject[] = [
  {
    path: "/",
    element: <LayoutProtect />,
    children: [
      {
        path: "dashboard",
        element: <Lazy component={() => import("../pages/Dasboard.tsx")} />,
      },
    ],
  },
];
export default RoutesProtect;
