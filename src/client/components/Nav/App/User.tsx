import { Link, useNavigate } from "react-router";
import useUserStore from "../../../store/User.ts";
import { useShallow } from "zustand/react/shallow";
import Logout from "../../../service/auth/logout.ts";

export function UserMenu() {
  //TODO: check path
  //TODO: if public routes hide user menu, change into login button
  //lihat netlify
  const navigate = useNavigate();
  const ListNav = [
    {
      name: "Settings",
      path: "/user/settings",
    },
    {
      name: "Organization",
      path: "/user/organization",
    },
    {
      name: "Help & Support",
      path: "/support",
    },
  ];
  const { email, name, img, setUserLogout } = useUserStore(
    useShallow(({ setUserLogout, img, name, email }) => ({
      setUserLogout,
      img,
      name,
      email,
    })),
  );
  if (!email) {
    return (
      <Link to="/login" className="btn btn-md btn-primary">
        Login
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component" src={img} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to="/user/settings" className="text-lg font-bold">
            {name}
          </Link>
        </li>
        <li>
          <Link to="/user/settings" className="text-md mb-3 font-light">
            {email}
          </Link>
        </li>
        {ListNav.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
        <li className="mt-3">
          <button
            onClick={async () => {
              Logout(() => {
                setUserLogout();
                navigate("/login");
              });
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
