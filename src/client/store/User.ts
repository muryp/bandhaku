import { create } from "zustand";
import { persist } from "zustand/middleware";

type TArgsSetUser = {
  name: string;
  email: string;
  img: string;
  theme: string;
};
interface ThemeStore {
  theme: string;
  name: string | null;
  email: string | null;
  img: string;
  setTheme: (theme: string) => void;
  setUser: (UserData: TArgsSetUser) => void;
  setUserLogout: () => void;
}

const useUserStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark", // default value
      name: null,
      email: null,
      img: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      setTheme: (theme) => set({ theme }),
      setUser: ({ name, email, img, theme }) =>
        set(() => ({ name, email, img, theme })),
      setUserLogout: () =>
        set(() => ({
          name: null,
          email: null,
          img: "",
          theme: "dark",
        })),
    }),
    {
      name: "UserInfo",
    },
  ),
);

export default useUserStore;
