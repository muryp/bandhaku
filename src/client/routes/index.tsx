import { createHashRouter } from "react-router";
import Layout from "../layouts/index.tsx";
import RoutesPublic from "./public.tsx";
import RoutesProtect from "./protect.tsx";

const routes = createHashRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [...RoutesPublic, ...RoutesProtect],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default routes;
