import './style.css'

export const DateFilter = () => {
  return html`
    <div class="form-group">
      <label class="label-caps">Period</label>
      <div class="date-filter-container">
        <select name="period" class="selection-input-field" id="period-select">
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>

        <div
          id="custom-date-inputs"
          class="custom-date-inputs"
          >
          <input type="date" name="start" class="selection-input-field" />
          <input type="date" name="end" class="selection-input-field" />
        </div>
      </div>
    </div>
  `
}
