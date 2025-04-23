import { signOut } from "firebase/auth";
import { auth } from "../../configs/firebase.ts";

//TODO: delete jwt
export default async function Logout(success: ()=>void) {
  return await signOut(auth)
    .then(() => {
      success();
    })
    .catch((error: ErrorEvent) => {
      return error;
    });
}
