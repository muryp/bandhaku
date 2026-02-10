export type TAutocompleteOption = {
  label: string
  value: string
  icon?: string
}

export interface TAutocompleteProps {
  label: string
  placeholder?: string
  suggestions: (string | TAutocompleteOption)[]
  // Sekarang initialValues bisa berupa array of objects agar icon tetap muncul
  initialValues?: (string | TAutocompleteOption)[]
  name?: string
  required?: boolean
  error?: string
  // Callback untuk reaktivitas
  onChange?: (values: TAutocompleteOption[]) => void
}
