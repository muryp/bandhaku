import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useUserStore from "../../store/User.ts";
import { useShallow } from "zustand/react/shallow";
import CheckAuth from "../../service/auth/checkAuth.ts";
import { LoginEmail } from "../../service/auth/login.ts";

//TODO: CHECK EMAIL,PASSWORD. IF NOT ERROR LOGIN
// TODO: SEDERHANAKAN PENGGUNAAN ZUSTAND
const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, name } = useUserStore(
    useShallow(({ setUser, name }) => ({ setUser, name })),
  );
  if (name) {
    navigate("/");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = CheckAuth();
  useEffect(() => {
    if (isLogin) {
      setUser(isLogin);
      navigate("/");
    }
  }, [isLogin]);

  return (
    <div className="w-full">
      <fieldset className="m-auto fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          className="input validator"
          type="email"
          required
          placeholder="mail@site.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="validator-hint hidden">Enter valid email address</div>

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => LoginEmail({ email, password, navigate, setUser })}
          className="btn btn-neutral mt-4"
        >
          Login
        </button>
        <p className="label font-light">
          Belum punya akun?{" "}
          <Link className="font-bold" to="/register">
            Daftar sekarang!
          </Link>
        </p>
        <div className="divider">OR</div>
        <button className="btn btn-neutral mt-4">Login Via Google</button>
      </fieldset>
    </div>
  );
};

export default LoginPage;
