export function validateName(name: string): string[] {
  const errors: string[] = [];

  // 1. Tidak boleh kosong
  if (name === "") {
    errors.push("Nama tidak boleh kosong.");
    return errors;
  }

  // 2. Panjang karakter wajar (2–100)
  const length = [...name].length;
  if (length < 2) {
    errors.push("Nama terlalu pendek (minimal 2 karakter).");
  } else if (length > 100) {
    errors.push("Nama terlalu panjang (maksimal 100 karakter).");
  }

  // 3. Hindari karakter kontrol (tidak terlihat)
  for (const ch of name) {
    if (ch <= "\u001F" || ch === "\u007F") {
      errors.push("Nama mengandung karakter tidak valid.");
      break;
    }
  }

  // 4. Opsional: larang simbol berbahaya (<>@"/$%…)
  if (/[<>@#$%^*+={}[\]\\\/]/.test(name)) {
    errors.push("Nama mengandung karakter yang tidak diperbolehkan.");
  }

  return errors;
}
