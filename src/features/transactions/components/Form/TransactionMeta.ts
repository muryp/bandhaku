import { Autocomplete } from '../Autocomplete'
import { dummyTags } from '../../db'

export const TransactionMeta = (initial?: Partial<Transaction>) => {
  const wallets = ['Cash', 'Mandiri', 'BCA', 'GoPay']
  const tagList = Array.isArray(initial?.tags) ? initial.tags : []

  const walletOptions = wallets
    .map((w) => {
      const isSelected = initial?.wallet === w ? 'selected' : ''
      return html`<option value="${w}" ${isSelected}>${w}</option>`
    })
    .join('')

  const refVal = initial?.ref || ''
  const descVal = initial?.desc || ''

  return html`
    ${Autocomplete('Tags', 'Add category...', dummyTags, tagList)}

    <div class="grid-2">
      <div class="form-group">
        <label for="wallet">Wallet</label>
        <select name="wallet" id="wallet">
          ${walletOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="ref">Ref / Invoice No.</label>
        <input
          type="text"
          name="ref"
          id="ref"
          value="${refVal}"
          placeholder="Optional" />
      </div>
    </div>

    <div class="form-group">
      <label for="desc">Description</label>
      <textarea name="desc" id="desc" rows="2" placeholder="...">
 ${descVal} </textarea
      >
    </div>
  `
}
