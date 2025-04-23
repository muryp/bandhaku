import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../../configs/firebase.ts";

type TArgs = {
  email: string;
  password: string;
  name:string
};
export const RegisterEmail = async ({ email, password }: TArgs) => {
//TODO: get url before (example from add budget but not login)
//TODO: after success redirect
//TODO: add jwt
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      useNavigate()("/");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    alert(errorMessage)
      console.log(errorCode, errorMessage);
      // ..
    });
};
