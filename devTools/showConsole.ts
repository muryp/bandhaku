/* eslint-disable no-console */
// ==================== TYPES ====================
type Primitive = string | number | boolean | null | undefined | bigint | symbol
type LoggableData = Primitive | object | Function

type NodeType = 'primitive' | 'array' | 'function' | 'object'
type ActionMode = 'idle' | 'delete' | 'copy' | 'askai'

interface LoggerConfig {
  targetElementId: string
  clearButtonId?: string
  copyButtonId?: string
  askAiButtonId?: string
  deleteSelectedButtonId?: string
  cancelButtonId?: string
  selectModeIndicatorId?: string
  aiPromptTemplate?: string
}

// ==================== NODE RENDERER MODULE ====================
function createNodeRenderer() {
  const getNodeType = (data: LoggableData): NodeType => {
    if (data === null || (typeof data!== 'object' && typeof data!== 'function')) {
      return 'primitive'
    }
    if (Array.isArray(data)) return 'array'
    if (typeof data === 'function') return 'function'
    return 'object'
  }

  const getPrimitiveClass = (type: string): string => {
    if (type === 'string') return 'string'
    if (type === 'boolean') return 'boolean'
    return 'number'
  }

  const createKeySpan = (key: string): HTMLSpanElement => {
    const span = document.createElement('span')
    span.className = 'key'
    span.textContent = `${key}:`
    return span
  }

  const createWrapper = (): HTMLDivElement => {
    const wrapper = document.createElement('div')
    wrapper.className = 'node'
    return wrapper
  }

  const renderPrimitive = (data: Primitive, key: string | null): HTMLDivElement => {
    const wrapper = createWrapper()
    const row = document.createElement('div')
    row.style.display = 'flex'

    if (key) row.appendChild(createKeySpan(key))

    const valueSpan = document.createElement('span')
    valueSpan.className = getPrimitiveClass(typeof data)
    valueSpan.textContent = typeof data === 'string'? `"${data}"` : String(data)

    row.appendChild(valueSpan)
    wrapper.appendChild(row)
    return wrapper
  }

  const createLabel = (data: object | Function, nodeType: NodeType): HTMLSpanElement => {
    const label = document.createElement('span')
    switch (nodeType) {
      case 'array':
        const arr = data as unknown[]
        label.innerHTML = `<span class="bracket">[</span> Array(${arr.length}) <span class="bracket">]</span>`
        break
      case 'function':
        const fn = data as Function
        label.innerHTML = `<span class="func-head">ƒ ${fn.name || 'anonymous'}()</span>`
        break
      case 'object':
        label.innerHTML = `<span class="bracket">{</span> Object <span class="bracket">}</span>`
        break
    }
    return label
  }

  const createContent = (data: object | Function, nodeType: NodeType): HTMLDivElement => {
    const content = document.createElement('div')
    content.className = 'node-content'

    if (nodeType === 'function') {
      const pre = document.createElement('div')
      pre.className = 'code-block'
      pre.textContent = (data as Function).toString()
      content.appendChild(pre)
    } else {
      const obj = data as Record<string, LoggableData>
      Object.keys(obj).forEach((k) => {
        content.appendChild(render(obj[k], k))
      })
    }
    return content
  }

  const renderExpandable = (
    data: object | Function,
    key: string | null,
    nodeType: Exclude<NodeType, 'primitive'>
  ): HTMLDivElement => {
    const wrapper = createWrapper()

    const header = document.createElement('div')
    header.className = 'node-header'

    const arrow = document.createElement('span')
    arrow.className = 'arrow'
    arrow.textContent = '▶'
    header.appendChild(arrow)

    if (key) header.appendChild(createKeySpan(key))
    header.appendChild(createLabel(data, nodeType))

    const content = createContent(data, nodeType)

    header.onclick = (e: MouseEvent): void => {
      e.stopPropagation()
      wrapper.classList.toggle('expanded')
    }

    wrapper.appendChild(header)
    wrapper.appendChild(content)
    return wrapper
  }

  const render = (data: LoggableData, key: string | null = null): HTMLDivElement => {
    const nodeType = getNodeType(data)
    return nodeType === 'primitive'
    ? renderPrimitive(data as Primitive, key)
      : renderExpandable(data as object | Function, key, nodeType)
  }

  return { render }
}

// ==================== LOGGER MODULE ====================
function createConsoleLogger(config: LoggerConfig) {
  const renderer = createNodeRenderer()
  const targetElement = document.getElementById(config.targetElementId) as HTMLDivElement

  if (!targetElement) {
    throw new Error(`createConsoleLogger: Element #${config.targetElementId} not found`)
  }

  let actionMode: ActionMode = 'idle'
  const defaultAiPrompt = `Jelaskan kenapa error/warn berikut terjadi dan cara memperbaikinya:\n\n`

  const originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  }

  const getButton = (id?: string): HTMLButtonElement | null => {
    return id? (document.getElementById(id) as HTMLButtonElement) : null
  }

  const allActionButtons = [
    config.deleteSelectedButtonId,
    config.copyButtonId,
    config.askAiButtonId,
    config.clearButtonId,
  ].map(getButton).filter(Boolean) as HTMLButtonElement[]

  const cancelButton = getButton(config.cancelButtonId)
  const indicator = getButton(config.selectModeIndicatorId)

  // Simpan text asli semua button
  const buttonOriginalTexts = new Map<string, string>()
  allActionButtons.forEach(btn => {
    buttonOriginalTexts.set(btn.id, btn.textContent || '')
  })

  const renderLog = (args: LoggableData[], logType: 'log' | 'warn' | 'error' = 'log'): void => {
    const row = document.createElement('div')
    row.className = `log-row log-${logType}`
    row.dataset.logEntry = 'true'
    row.dataset.logType = logType

    const controls = document.createElement('div')
    controls.className = 'log-controls'
    controls.dataset.controls = 'true'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'log-checkbox'
    checkbox.dataset.logSelect = 'true'

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'log-delete-btn'
    deleteBtn.innerHTML = '✕'
    deleteBtn.title = 'Delete this log'
    deleteBtn.onclick = (e) => {
      e.stopPropagation()
      row.remove()
    }

    controls.appendChild(checkbox)
    controls.appendChild(deleteBtn)
    row.appendChild(controls)

    const contentWrapper = document.createElement('div')
    contentWrapper.className = 'log-content'
    args.forEach((arg) => contentWrapper.appendChild(renderer.render(arg)))
    row.appendChild(contentWrapper)

    targetElement.appendChild(row)
    targetElement.scrollTop = targetElement.scrollHeight
  }

  const clear = (): void => {
    targetElement.innerHTML = ''
    setActionMode('idle')
  }

  const setActionMode = (mode: ActionMode): void => {
    actionMode = mode
    const isActive = mode!== 'idle'

    const allControls = targetElement.querySelectorAll('[data-controls="true"]')
    allControls.forEach((ctrl) => {
      ctrl.classList.toggle('show', isActive)
    })

    // Hide tombol lain + ganti text tombol aktif jadi "Confirm..."
    allActionButtons.forEach((btn) => {
      const originalText = buttonOriginalTexts.get(btn.id) || ''
      const isActiveButton = btn.id === getActiveButtonId()

      if (isActive) {
        if (isActiveButton) {
          btn.textContent = `Confirm ${originalText}`
          btn.style.display = 'flex'
        } else {
          btn.textContent = originalText
          btn.style.display = 'none'
        }
      } else {
        btn.textContent = originalText
        btn.style.display = 'flex'
      }
    })

    cancelButton?.classList.toggle('show', isActive)
    indicator?.classList.toggle('show', isActive)

    if (!isActive) {
      targetElement.querySelectorAll('input[data-log-select]:checked').forEach((cb) => {
        ;(cb as HTMLInputElement).checked = false
      })
    }
  }

  const getActiveButtonId = (): string | undefined => {
    switch (actionMode) {
      case 'delete': return config.deleteSelectedButtonId
      case 'copy': return config.copyButtonId
      case 'askai': return config.askAiButtonId
      default: return undefined
    }
  }

  const getSelectedRows = (): Element[] => {
    return Array.from(
      targetElement.querySelectorAll('[data-log-entry="true"]:has(input[data-log-select]:checked)')
    )
  }

  const getSelectedLogsWithType = (): Array<{ text: string; type: string }> => {
    return getSelectedRows().map((row) => {
      const content = row.querySelector('.log-content')
      return {
        text: content?.textContent?.trim() || '',
        type: (row as HTMLElement).dataset.logType || 'log',
      }
    })
  }

  const handleDeleteSelected = (): void => {
    if (actionMode!== 'delete') {
      setActionMode('delete')
      return
    }
    const selectedRows = getSelectedRows()
    if (!selectedRows.length) {
      originalConsole.warn('No logs selected')
      setActionMode('idle')
      return
    }
    selectedRows.forEach((row) => row.remove())
    originalConsole.log(`Deleted ${selectedRows.length} log(s)`)
    setActionMode('idle')
  }

  const handleCopy = async (): Promise<void> => {
    if (actionMode!== 'copy') {
      setActionMode('copy')
      return
    }
    const text = getSelectedLogsWithType().map((l) => l.text).join('\n\n')
    if (!text) {
      originalConsole.warn('No logs selected')
      setActionMode('idle')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      originalConsole.log('Selected logs copied to clipboard')
      setActionMode('idle')
    } catch (err) {
      originalConsole.error('Failed to copy:', err)
    }
  }

  const handleAskAi = async (): Promise<void> => {
    if (actionMode!== 'askai') {
      setActionMode('askai')
      return
    }
    const selectedLogs = getSelectedLogsWithType()
    if (!selectedLogs.length) {
      originalConsole.warn('No logs selected for AI')
      setActionMode('idle')
      return
    }
    const hasWarnOrError = selectedLogs.some((l) => l.type === 'warn' || l.type === 'error')
    const prompt = config.aiPromptTemplate || defaultAiPrompt
    const contextPrefix = hasWarnOrError
    ? 'Berikut adalah log warning/error dari aplikasi:\n\n'
      : 'Berikut adalah log dari aplikasi:\n\n'
    const logText = selectedLogs.map((l) => {
        const prefix = l.type === 'error'? '[ERROR] ' : l.type === 'warn'? ' ' : '[LOG] '
        return prefix + l.text
      }).join('\n\n')
    const finalPrompt = prompt + contextPrefix + logText + '\n\nTolong jelaskan penyebab dan solusinya.'
    try {
      await navigator.clipboard.writeText(finalPrompt)
      originalConsole.log('AI prompt copied to clipboard. Paste ke ChatGPT/Claude')
      setActionMode('idle')
    } catch (err) {
      originalConsole.error('Failed to copy:', err)
    }
  }

  const handleCancel = (): void => {
    setActionMode('idle')
    originalConsole.log('Action cancelled')
  }

  const setupButtons = (): void => {
    if (config.clearButtonId) {
      document.getElementById(config.clearButtonId)?.addEventListener('click', clear)
    }
    if (config.deleteSelectedButtonId) {
      document.getElementById(config.deleteSelectedButtonId)?.addEventListener('click', handleDeleteSelected)
    }
    if (config.copyButtonId) {
      document.getElementById(config.copyButtonId)?.addEventListener('click', handleCopy)
    }
    if (config.askAiButtonId) {
      document.getElementById(config.askAiButtonId)?.addEventListener('click', handleAskAi)
    }
    cancelButton?.addEventListener('click', handleCancel)
  }

  const init = (): void => {
    console.log = (...args: LoggableData[]): void => {
      renderLog(args, 'log')
      originalConsole.log(...args)
    }
    console.warn = (...args: LoggableData[]): void => {
      renderLog(args, 'warn')
      originalConsole.warn(...args)
    }
    console.error = (...args: LoggableData[]): void => {
      renderLog(args, 'error')
      originalConsole.error(...args)
    }
    setupButtons()
  }

  const destroy = (): void => {
    console.log = originalConsole.log
    console.warn = originalConsole.warn
    console.error = originalConsole.error
  }

  return { init, destroy, clear }
}

// ==================== USAGE ====================
const logger = createConsoleLogger({
  targetElementId: 'v-console',
  clearButtonId: 'btnClear',
  copyButtonId: 'btnCopy',
  askAiButtonId: 'btnAskAI',
  deleteSelectedButtonId: 'btnDeleteSelected',
  cancelButtonId: 'btnCancel',
  selectModeIndicatorId: 'selectModeIndicator',
  aiPromptTemplate: 'Kamu adalah senior debugger. Analisa log berikut:\n\n',
})

logger.init()

// --- TEST DEMO ---
console.log('Welcome to Console tanpa Tailwind')
console.log({ user: 'Admin', role: 'developer',hello:[1,5,5,7,5,7,6,7,'hsisj','djidhd','djdi'],sub:{ user: 'Admin', role: 'developer',hello:[1,5,5,7,5,7,6,7,'hsisj','djidhd','djdi'] } })
console.warn('Deprecated API detected')
console.error('TypeError: Cannot read property of undefined')