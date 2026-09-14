// main.tsx
import { enableTransactionMock } from './transaction'
if (import.meta.env.DEV) {
  enableTransactionMock()
  // Simulasi semua sukses
  window.__MOCK_SCENARIO = 'success'
  //
  // // Simulasi ada conflict: bikin 1 tx, ubah di "server", sync lagi
  // window.__MOCK_SCENARIO = 'conflict'
  //
  // // Simulasi server 500
  // window.__MOCK_SCENARIO = 'error'
  //
  // // Simulasi timeout >30s
  // window.__MOCK_SCENARIO = 'timeout'
  //
  // // Simulasi sebagian gagal validasi
  // window.__MOCK_SCENARIO = 'partial'
}
