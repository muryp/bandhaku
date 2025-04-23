import { RouterProvider } from "react-router";
import routes from "./routes";

export default function MainRoutes() {
  return <RouterProvider router={routes} />;
}
