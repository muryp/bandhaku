export default function validatorEmail(email: string) {
  const errors: string[] = [];

  if (email.length === 0) {
    errors.push("Email tidak boleh kosong.");
    return errors;
  }

  if (/\s/.test(email)) {
    errors.push("Email tidak boleh mengandung spasi.");
  }

  const atCount = (email.match(/@/g) || []).length;
  if (atCount === 0) {
    errors.push('Email harus mengandung satu simbol "@".');
  } else if (atCount > 1) {
    errors.push('Email hanya boleh mengandung satu simbol "@".');
  }

  const parts = email.split("@");
  if (parts.length === 2) {
    const [local, domain] = parts;

    if (local.length === 0) {
      errors.push('Bagian sebelum "@" tidak boleh kosong.');
    }

    if (domain.length === 0) {
      errors.push('Bagian domain (setelah "@") tidak boleh kosong.');
    } else {
      if (!domain.includes(".")) {
        errors.push('Domain harus mengandung "." (contoh: domain.com).');
      } else {
        const domainParts = domain.split(".");
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) {
          errors.push(
            "TLD (bagian setelah titik terakhir) harus minimal 2 karakter.",
          );
        }
      }
    }
  }

  // Format umum regex dasar
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  if (!basicRegex.test(email)) {
    errors.push("Format email sepertinya tidak valid.");
    // Hanya tambahkan ini jika belum ada kesalahan format yang lebih spesifik
  }

  return errors;
}
