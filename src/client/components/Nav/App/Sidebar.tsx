import { Link } from "react-router";
import { IconMenuClose } from "../../../../assets/icons/Menu.tsx";
import { ListNav, NAME_DRAWER } from "./config.ts";

export function SidebarMenu() {
  const clickLink = () => {
    const getCheckbox = document.getElementById(
      NAME_DRAWER,
    ) as HTMLInputElement;
    if (getCheckbox) {
      getCheckbox.checked = false;
    }
  };
  return (
    <div className="drawer-side md:!visible md:!opacity-100 md:w-fit md:fixed md:left-0 md:top-0 md:h-screen md:pointer-events-auto">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <ul className="menu bg-base-200 rounded-box w-52 h-full md:!translate-0 z-50">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="ml-auto md:hidden"
        >
          <IconMenuClose />
        </label>

        {ListNav.map((item, index) => (
          <li key={index}>
            <Link onClick={clickLink} to={item.path}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
