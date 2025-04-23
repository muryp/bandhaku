import { useShallow } from "zustand/react/shallow";
import { useFormStore } from "../../store/Form.ts";
import { useEffect, useState } from "react";

export default function InputConfirmPassword() {
  const {
    confirmPassword,
    setConfirmPassword,
    password,
    setIsErrorConfirmPassword,
  } = useFormStore(
    useShallow(
      ({
        confirmPassword,
        setConfirmPassword,
        password,
        setIsErrorConfirmPassword,
      }) => ({
        confirmPassword,
        setConfirmPassword,
        setIsErrorConfirmPassword,
        password,
      }),
    ),
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState(
    undefined as string | undefined,
  );
  const isErr =
    confirmPasswordError !== undefined && confirmPasswordError !== "";
  setIsErrorConfirmPassword(isErr);
  useEffect(() => {
    if (confirmPassword) {
      console.log('isErr', confirmPassword === "")
      if (password !== confirmPassword) {
        setConfirmPasswordError("Password not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  }, [password, confirmPassword]);

  return (
    <>
      <label className="label">Confirm Password</label>
      <input
        type="password"
        className={
          "input " +
          (confirmPasswordError !== undefined &&
            (isErr ? "input-error" : "input-success"))
        }
        required
        value={confirmPassword}
        placeholder="Confirm Password"
        autoComplete="new-password"
        title="Must be same as password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />
      {isErr && <p className="text-error">{confirmPasswordError}</p>}
    </>
  );
}
