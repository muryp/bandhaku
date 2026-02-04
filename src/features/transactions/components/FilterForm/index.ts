import { db } from '../../db'
import { Autocomplete } from '../Autocomplete'
import { DateFilter } from '../DateFilter'
import './style.css'

export const FilterForm = (formId: string) => {
  return html`
    <form ${formId} class="filter-section">
      <div class="filter-grid">
        ${Autocomplete('Client', 'Search client...', db.clients)}
        ${Autocomplete('Tags', 'Filter tags...', db.tags)}
        ${DateFilter()}

        <div class="form-group">
          <label class="label-caps">Properties</label>
          <div class="input-row">
            <select name="type" class="input-select">
              <option value="all">All Types</option>
              <option value="piutang">Piutang</option>
              <option value="utang">Utang</option>
            </select>
            <select name="wallet" class="input-select">
              <option value="all">All Wallets</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <button type="submit" class="btn-primary-wide">Apply Filter</button>
        </div>
      </div>
    </form>
  `
}