import { Outlet } from "react-router";
import { NavApp } from "../components/Nav/App/index.tsx";

// SidebarWithDropdown.jsx
// <div className="max-w-3xl ml-auto">
export default function Layout() {
  return (
    <div className="max-w-4xl w-full md:w-10/12 md:ml-52">
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <NavApp />
      <Outlet />
    </div>
  );
}
