import { Link } from "react-router";
import InputName from "../../components/Input/Name.tsx";
import InputEmail from "../../components/Input/Email.tsx";
import InputPassword from "../../components/Input/Password.tsx";
import InputConfirmPassword from "../../components/Input/ConfirmPassword.tsx";
import BtnRegister from "../../components/Btn/Register.tsx";

//TODO: CHECK EMAIL,PASSWORD, confirm password, name. IF NOT ERROR REGISTER
const Register = () => {
  console.log("register render");
  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const Btn = document.getElementById(
            "btn-register",
          ) as HTMLButtonElement;
          Btn.click();
        }}
        className="m-auto fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="fieldset-legend">Register</legend>
        <InputName />
        <InputEmail />
        <InputPassword />
        <InputConfirmPassword />
        <BtnRegister />

        <p className="label font-light">
          Sudah punya akun?{" "}
          <Link className="font-bold" to="/Login">
            Login!
          </Link>
        </p>
      </form>
      <div className="divider">OR</div>
      <div className="m-auto w-fit">
        <button className="btn btn-neutral mt-4">Login Via Google</button>
      </div>
    </div>
  );
};

export default Register;
