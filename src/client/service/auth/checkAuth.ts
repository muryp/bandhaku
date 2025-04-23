import { auth } from "../../configs/firebase.ts";

// TODO: GET THEME
export default function CheckAuth() {
  const user = auth.currentUser;
  if (user) {
    return {
      email: user.email!,
      name: user.displayName!,
      img: user.photoURL!,
      theme:'dark',
    };
  }
  return false;
}
