import { useShallow } from "zustand/react/shallow";
import { useFormStore } from "../../store/Form.ts";
import validatorEmail from "../../../shared/emailCheck.ts";
import { useEffect, useState } from "react";

export default function InputEmail() {
  const { email, setEmail, setIsErrorEmail } = useFormStore(
    useShallow(({ email, setEmail, setIsErrorEmail }) => ({
      email,
      setEmail,
      setIsErrorEmail,
    })),
  );
  const [emailError, setEmailError] = useState<string[] | undefined>(undefined);
  const isError = emailError && emailError.length > 0;
  useEffect(() => {
    if (email) {
      const checkErr = validatorEmail(email);
      setEmailError(checkErr);
      setIsErrorEmail(checkErr.length > 0 ? true : false);
    }
  }, [email]);

  return (
    <div>
      <label className="label">Email</label>
      <input
        className={
          "input " +
          (isError !== undefined
            ? isError
              ? "input-error"
              : "input-success"
            : "")
        }
        type="email"
        required
        placeholder="mail@site.com"
        value={email}
        autoComplete="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      {emailError && <p className="text-error">{emailError.join(", ")}</p>}
    </div>
  );
}
