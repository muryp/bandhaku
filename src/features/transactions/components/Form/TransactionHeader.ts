import { Autocomplete } from '../Autocomplete'
import { dummyClients } from '../../db'

export const TransactionHeader = (initial?: Partial<Transaction>) => {
  // Logic persiapan data
  const today = new Date().toISOString().split('T')[0]
  const dateVal = initial?.date || today

  const isPiutang = initial?.type === 'piutang' ? 'selected' : ''
  const isUtang = initial?.type === 'utang' ? 'selected' : ''

  const clientList = Array.isArray(initial?.client)
    ? initial.client
    : initial?.client
      ? [initial.client]
      : []

  return html`
    <div class="grid-2">
      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" name="date" id="date" value="${dateVal}" required />
      </div>
      <div class="form-group">
        <label for="type">Transaction Type</label>
        <select name="type" id="type">
          <option value="piutang" ${isPiutang}>Piutang</option>
          <option value="utang" ${isUtang}>Utang</option>
        </select>
      </div>
    </div>
    ${Autocomplete('Client', 'Search client...', dummyClients, clientList)}
  `
}
