export default function passwordCheck(password: string) {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password harus minimal 8 karakter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password harus mengandung simbol (misalnya !@#$%^&*)');
  }

  return errors;
}
