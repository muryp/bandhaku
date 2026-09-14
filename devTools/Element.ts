export const ElementHtml = `
<style>
  /* ========== OVERLAY ========== */
  #overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 998;
  }
  #overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* ========== BOTTOM SHEET ========== */
  #bottomSheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1e293b;
    border-radius: 20px 20px 0 0;
    padding: 8px 20px 32px;
    transform: translateY(100%);
    transition: transform 0.3s ease-out;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.5);
    touch-action: none;
    visibility: hidden;
    z-index: 999;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
  }
  #bottomSheet.visible {
    transform: translateY(0);
    visibility: visible;
  }

  #bottomSheet #dragHandle {
    width: 40px;
    height: 4px;
    background: #475569;
    border-radius: 2px;
    margin: 8px auto 16px;
    cursor: grab;
    flex-shrink: 0;
  }
  #bottomSheet #dragHandle:active {
    cursor: grabbing;
    background: #64748b;
  }

  #bottomSheet #sheetContent {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
  }

  /* ========== CONSOLE ========== */
  #bottomSheet .console-wrapper {
    max-width: 768px;
    margin: 0 auto;
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  #bottomSheet .console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 6px;
    flex-shrink: 0;
  }
  #bottomSheet .console-title {
    font-weight: bold;
    color: #cbd5e1;
    font-size: 14px;
  }
  #bottomSheet #selectModeIndicator {
    font-size: 12px;
    color: #818cf8;
    display: none;
  }
  #bottomSheet #selectModeIndicator.show {
    display: inline;
  }

  #bottomSheet #v-console {
    flex: 1;
    min-height: 0;
    background: #1e1e1e;
    color: #ccc;
    font-family: monospace;
    font-size: 12px;
    border-radius: 8px;
    overflow-y: auto;
    border: 1px solid #000;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
    padding-bottom: 48px;
  }

  /* ========== LOG ROW ========== */
  #bottomSheet .log-row {
    position: relative;
    padding: 10px 14px;
    border-bottom: 1px solid #333;
    line-height: 1.6;
  }
  #bottomSheet .log-row.log-warn {
    background: rgba(234, 179, 8, 0.1);
    border-left: 4px solid #eab308;
  }
  #bottomSheet .log-row.log-error {
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
  }
  #bottomSheet .log-controls {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  #bottomSheet .log-controls.show {
    opacity: 1;
  }
  #bottomSheet .log-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #64748b;
    background: #334155;
    accent-color: #6366f1;
    cursor: pointer;
  }
  #bottomSheet .log-delete-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    background: transparent;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  #bottomSheet .log-delete-btn:hover {
    color: #ef4444;
    background: #334155;
  }
  #bottomSheet .log-content {
    padding-right: 64px;
  }

  /* ========== NODE RENDERER ========== */
  #bottomSheet .node {
    display: block;
    width: 100%;
  }
  #bottomSheet .node-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 2px 0;
    transition: background 0.2s;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  #bottomSheet .node-header:hover {
    background: #2a2a2a;
  }
  #bottomSheet .node-content {
    display: none;
    padding-left: 12px;
    margin-left: 8px;
    border-left: 1px solid #444;
    overflow-x: auto;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  #bottomSheet .node.expanded > .node-content {
    display: block;
  }
  #bottomSheet .arrow {
    width: 20px;
    color: #888;
    font-size: 12px;
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  #bottomSheet .node.expanded > .node-header .arrow {
    transform: rotate(90deg);
  }
  #bottomSheet .key {
    color: #9cdcfe;
    margin-right: 6px;
  }
  #bottomSheet .string {
    color: #ce9178;
    word-break: break-all;
  }
  #bottomSheet .number {
    color: #b5cea8;
  }
  #bottomSheet .boolean {
    color: #569cd6;
  }
  #bottomSheet .func-head {
    color: #dcdcaa;
    font-style: italic;
  }
  #bottomSheet .bracket {
    color: rgba(250, 204, 21, 0.8);
  }
  #bottomSheet .code-block {
    background: #161616;
    color: #d4d4d4;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #333;
    margin: 8px 0;
    white-space: pre-wrap;
    font-size: 12px;
    width: 100%;
  }

  /* ========== FIXED BUTTONS ========== */
  #bottomSheet .fixed-buttons {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 1000;
  }
  #bottomSheet .fixed-buttons button {
    display: flex;
    align-items: center;
    gap: 4px;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: none;
    white-space: nowrap;
  }
  #bottomSheet .fixed-buttons button svg {
    flex-shrink: 0;
  }
  #bottomSheet #btnCancel {
    background: #64748b;
    display: none;
  }
  #bottomSheet #btnCancel:hover {
    background: #475569;
  }
  #bottomSheet #btnCancel.show {
    display: flex;
  }
  #bottomSheet #btnDeleteSelected {
    background: #ea580c;
  }
  #bottomSheet #btnDeleteSelected:hover {
    background: #c2410c;
  }
  #bottomSheet #btnCopy {
    background: #475569;
  }
  #bottomSheet #btnCopy:hover {
    background: #334155;
  }
  #bottomSheet #btnAskAI {
    background: #4f46e5;
  }
  #bottomSheet #btnAskAI:hover {
    background: #4338ca;
  }
  #bottomSheet #btnClear {
    background: #dc2626;
  }
  #bottomSheet #btnClear:hover {
    background: #b91c1c;
  }
  #bottomSheet #hide-console {
    background: #dc2626;
  }
  #bottomSheet #hide-console:hover {
    background: #b91c1c;
  }
</style>
  <!-- Overlay -->
  <div id="overlay"></div>

  <!-- Bottom Sheet -->
  <div id="bottomSheet">
    <div id="dragHandle"></div>
    <div id="sheetContent">
      <div class="console-wrapper">
        <div class="console-header">
          <span class="console-title">System Console</span>
          <span id="selectModeIndicator">Select logs, then confirm</span>
        </div>
        <div id="v-console"></div>
      </div>

      <div class="fixed-buttons">
        <button id="btnCancel">Cancel</button>
        <button id="btnDeleteSelected">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
        <button id="btnCopy">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
        <button id="btnAskAI">Ask AI</button>
        <button id="btnClear">Clear</button>
        <button id="hide-console" title="Hide Console">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <script type="module" src="/devTools/script.ts"></script>
`
