import { useShallow } from "zustand/react/shallow";
import { useFormStore } from "../../store/Form.ts";
import passwordCheck from "../../../shared/passwordCheck.ts";
import { useEffect, useState } from "react";

export default function InputPassword() {
  const { password, setPassword, setIsErrorPassword } = useFormStore(
    useShallow(({ password, setPassword, setIsErrorPassword }) => ({
      password,
      setPassword,
      setIsErrorPassword,
    })),
  );
  const [passwordError, setPasswordError] = useState<string[] | undefined>(
    undefined,
  );
  const isError = passwordError && passwordError.length > 0;
  useEffect(() => {
    if (password) {
      const checkErr = passwordCheck(password);
      setPasswordError(checkErr);
      setIsErrorPassword(checkErr.length > 0 ? true : false);
    }
  }, [password]);

  return (
    <div>
      <label className="label">Password</label>
      <input
        autoComplete="new-password"
        type="password"
        className={
          "input " +
          (isError !== undefined && (isError ? "input-error" : "input-success"))
        }
        required
        placeholder="Password"
        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      {isError && <p className="text-error">{passwordError.join(", ")}</p>}
    </div>
  );
}
