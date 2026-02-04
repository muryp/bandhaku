import type { Transaction } from '../../types'

export const TransactionAmount = (initial?: Partial<Transaction>) => {
  const currencies = ['IDR', 'USD', 'EUR', 'SGD']

  // Pisahkan logika loop dari template
  const currencyOptions = currencies
    .map((curr) => {
      const isSelected = initial?.currency === curr ? 'selected' : ''
      return html`<option value="${curr}" ${isSelected}>${curr}</option>`
    })
    .join('')

  const amountValue = initial?.amount || ''

  return html`
    <div class="grid-amount">
      <div class="form-group">
        <label for="amount">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value="${amountValue}"
          placeholder="0"
          required />
      </div>
      <div class="form-group">
        <label for="currency">Currency</label>
        <select name="currency" id="currency">
          ${currencyOptions}
        </select>
      </div>
    </div>
  `
}
