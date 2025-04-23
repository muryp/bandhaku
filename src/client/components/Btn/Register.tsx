import { RegisterEmail } from "../../service/auth/register.ts";
import { useFormStore } from "../../store/Form.ts";
import { useShallow } from "zustand/react/shallow";

export default function BtnRegister() {
  const {
    email,
    password,
    name,
    isErrorEmail,
    isErrorPassword,
    isErrorConfirmPassword,
    isErrorName,
  } = useFormStore(
    useShallow(
      ({
        email,
        password,
        name,
        isErrorEmail,
        isErrorPassword,
        isErrorConfirmPassword,
        isErrorName,
      }) => ({
        email,
        password,
        name,
        isErrorEmail,
        isErrorPassword,
        isErrorConfirmPassword,
        isErrorName,
      }),
    ),
  );

  const isErr =
    isErrorEmail || isErrorPassword || isErrorConfirmPassword || isErrorName;
  console.log({
    isErrorEmail,
    isErrorPassword,
    isErrorConfirmPassword,
    isErrorName,
  });
  const onClickRegister = () => {
    alert('hello')
    if (name) {
      RegisterEmail({ email, password, name });
    }
  };
  return (
    <button
      id="btn-register"
      onClick={onClickRegister}
      disabled={isErr}
      className="btn btn-neutral mt-4"
    >
      Confirm
    </button>
  );
}
