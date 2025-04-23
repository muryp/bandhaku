import { IconMenuOpen } from "../../../../assets/icons/Menu.tsx";
import { NAME_DRAWER } from "./config.ts";
import { SidebarMenu } from "./Sidebar.tsx";
import { ToggleThemes } from "./Toggle.tsx";
import { UserMenu } from "./User.tsx";

//TODO: NAV HILANG JIKA LOGIN
//TODO: REDIRECT KE LOGIN JIKA BELUM LOGIN
//TODO: KECUALI REGISTER
//TODO: KECUALI LOGIN
export function NavApp() {
  const TITLE = "MyApp";

  return (
    <div className="drawer">
      <input id={NAME_DRAWER} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none md:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <IconMenuOpen />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">{TITLE}</div>
          <div className="flex gap-3">
            <ToggleThemes />
            <UserMenu />
          </div>
        </div>
      </div>
      <SidebarMenu />
    </div>
  );
}
