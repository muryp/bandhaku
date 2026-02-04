import './style.css'
export const AddPages = html`
  <div class="form-card">
    <div
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Transaction</h2>
    </div>

    <form id="tx-form">
      <div class="grid-2">
        <div class="form-group">
          <label for="date">Date</label>
          <input type="date" id="date" required />
        </div>
        <div class="form-group">
          <label for="type">Transaction Type</label>
          <select id="type">
            <option value="piutang">Piutang (Receivable)</option>
            <option value="utang">Utang (Payable)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>
          Client
          <span class="add-action-trigger" data-target="client">Add New</span>
        </label>
        <div class="selection-display-container" id="client-box">
          <input
            type="text"
            id="client-input"
            class="selection-input-field"
            placeholder="Search or Type..." />
        </div>
        <div id="client-list" class="suggestion-dropdown-list"></div>
      </div>

      <div class="grid-amount">
        <div class="form-group">
          <label for="amount">Amount</label>
          <input type="number" id="amount" placeholder="0" required />
        </div>
        <div class="form-group">
          <label for="currency">Currency</label>
          <select id="currency">
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SGD">SGD</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>
          Tags
          <span class="add-action-trigger" data-target="tag">Add New</span>
        </label>
        <div class="selection-display-container" id="tag-box">
          <input
            type="text"
            id="tag-input"
            class="selection-input-field"
            placeholder="Search or Type..." />
        </div>
        <div id="tag-list" class="suggestion-dropdown-list"></div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label for="wallet">Wallet</label>
          <select id="wallet">
            <option value="Cash">Cash</option>
            <option value="Mandiri">Bank Mandiri</option>
            <option value="BCA">Bank BCA</option>
            <option value="GoPay">GoPay</option>
          </select>
        </div>
        <div class="form-group">
          <label for="ref">Ref / Invoice No.</label>
          <input type="text" id="ref" placeholder="Optional" />
        </div>
      </div>

      <div class="form-group">
        <label for="desc">Description</label>
        <textarea
          id="desc"
          rows="2"
          placeholder="Write details here..."></textarea>
      </div>

      <button type="submit" class="btn-primary">Save Transaction</button>
    </form>
  </div>
`
