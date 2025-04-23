import { Outlet } from "react-router";
export default function LayoutProtect() {
  return (
    <div>
      <h1>this layout protect</h1>
      <Outlet />
    </div>
  );
}
