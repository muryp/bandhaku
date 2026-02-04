import './style.css'

export const TableRow = (tx: any) => {
  return html`
    <tr>
      <td><input type="checkbox" class="tx-check" value="${tx.id}" /></td>
      <td style="color: var(--text-muted); font-size: 0.85rem;">${tx.date}</td>
      <td><span class="badge badge-${tx.type}">${tx.type}</span></td>
      <td style="font-weight:600">${tx.client}</td>
      <td style="font-family:monospace; font-weight:700;">
        IDR ${tx.amount.toLocaleString('id-ID')}
      </td>
      <td><small>${tx.wallet}</small></td>
      <td>
        ${tx.tags.map((t) => `<span class="badge-tag-sm">${t}</span>`).join('')}
      </td>
      <td style="text-align:right">
        <button class="btn-edit-row">Edit</button>
      </td>
    </tr>
  `
}