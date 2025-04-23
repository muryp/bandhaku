import { signInWithEmailAndPassword } from "firebase/auth";
import { type NavigateFunction } from "react-router";
import { auth } from "../../configs/firebase.ts";
import useUserStore from "../../store/User.ts";

type TArgs = {
  email: string;
  password: string;
  navigate: NavigateFunction;
  setUser: (user: any) => void;
};

//TODO: get url before (example from add budget but not login)
//TODO: after success redirect
//TODO: add jwt
export const LoginEmail = async ({ email, password, navigate,setUser }: TArgs) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const { email, displayName, photoURL } = userCredential.user;
      setUser({
        name: displayName!,
        email: email!,
        img: photoURL!,
        theme: "dark",
      });
      navigate("/");
    })
    .catch((error) => {
      alert(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      console.log(errorCode, errorMessage);
    });
};
