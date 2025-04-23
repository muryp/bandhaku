import { useShallow } from "zustand/react/shallow";
import { useFormStore } from "../../store/Form.ts";
import { useEffect, useState } from "react";
import { validateName } from "../../../shared/nameCheck.ts";

export default function InputName() {
  const { name, setName, setIsErrorName } = useFormStore(
    useShallow(({ name, setName, setIsErrorName }) => ({
      name,
      setName,
      setIsErrorName,
    })),
  );
  const [error, setError] = useState<string[] | undefined>(undefined);
  const isError = error && error.length > 0;
  useEffect(() => {
    if (name) {
      const checkErr = validateName(name);
      setError(checkErr);
      setIsErrorName(checkErr.length > 0 ? true : false);
    }
  }, [name]);

  return (
    <div>
      <label className="label">Name</label>
      <input
        className={
          "input " +
          (isError !== undefined
            ? isError
              ? "input-error"
              : "input-success"
            : "")
        }
        type="text"
        required
        placeholder="Your Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      {error && <p className="text-error">{error.join(", ")}</p>}
    </div>
  );
}
