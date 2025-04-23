import { create } from "zustand";

export type FormStore = {
  // value
  password: string;
  name: string;
  email: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setName: (userName: string) => void;
  setEmail: (email: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;

  // isErr
  isErrorPassword: boolean;
  isErrorName: boolean;
  isErrorEmail: boolean;
  isErrorConfirmPassword: boolean;
  setIsErrorPassword: (isErrorPassword: boolean) => void;
  setIsErrorName: (isErrorName: boolean) => void;
  setIsErrorEmail: (isErrorEmail: boolean) => void;
  setIsErrorConfirmPassword: (isErrorConfirmPassword: boolean) => void;
};

export const useFormStore = create<FormStore>()((set) => ({
  // value
  password: "",
  name: '',
  email: "",
  confirmPassword: "",
  setPassword: (password: string) => set({ password }),
  setName: (userName: string) => set({ name: userName }),
  setEmail: (email: string) => set({ email }),
  setConfirmPassword: (confirmPassword: string) => set({ confirmPassword }),

  // isErr
  isErrorPassword: true,
  isErrorName: true,
  isErrorEmail: true,
  isErrorConfirmPassword: true,
  setIsErrorPassword: (isErrorPassword: boolean) => set({ isErrorPassword }),
  setIsErrorName: (isErrorName: boolean) => set({ isErrorName }),
  setIsErrorEmail: (isErrorEmail: boolean) => set({ isErrorEmail }),
  setIsErrorConfirmPassword: (isErrorConfirmPassword: boolean) =>
    set({ isErrorConfirmPassword }),
}));
