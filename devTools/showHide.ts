// ==================== TYPES ====================
interface BottomSheetConfig {
  sheetId: string
  overlayId: string
  contentId: string
  dragHandleId: string
  hideButtonId?: string
  swipeThresholdPx: number
  bottomEdgeTriggerPx: number
}

interface BottomSheetAPI {
  show: () => void
  hide: () => void
  toggle: () => void
  setContent: (html: string) => void
  destroy: () => void
}

// ==================== BOTTOM SHEET ====================
function createBottomSheet(config: BottomSheetConfig): BottomSheetAPI {
  const sheetEl = document.getElementById(config.sheetId) as HTMLDivElement
  const overlayEl = document.getElementById(config.overlayId) as HTMLDivElement
  const contentEl = document.getElementById(config.contentId) as HTMLDivElement
  const dragHandleEl = document.getElementById(config.dragHandleId) as HTMLDivElement
  const hideButtonEl = config.hideButtonId
  ? (document.getElementById(config.hideButtonId) as HTMLButtonElement)
    : null

  if (!sheetEl ||!overlayEl ||!contentEl ||!dragHandleEl) {
    throw new Error('BottomSheet: Element tidak ketemu')
  }

  let touchStartY = 0
  let isGestureActive = false

  const isVisible = (): boolean => sheetEl.classList.contains('visible')

  const show = (): void => {
    sheetEl.classList.add('visible')
    overlayEl.classList.add('visible')
    document.body.style.overflow = 'hidden'
  }

  const hide = (): void => {
    sheetEl.classList.remove('visible')
    overlayEl.classList.remove('visible')
    document.body.style.overflow = ''
  }

  const toggle = (): void => (isVisible()? hide() : show())

  const setContent = (html: string): void => {
    contentEl.innerHTML = html
  }

  const handleTouchStart = (e: TouchEvent): void => {
    if (isVisible()) return
    const startY = e.touches[0].clientY
    const inBottomZone = startY > window.innerHeight - config.bottomEdgeTriggerPx
    if (inBottomZone) {
      touchStartY = startY
      isGestureActive = true
    }
  }

  const handleTouchMove = (e: TouchEvent): void => {
    if (!isGestureActive || isVisible()) return
    const currentY = e.touches[0].clientY
    const deltaY = touchStartY - currentY
    if (deltaY > config.swipeThresholdPx) {
      e.preventDefault()
      show()
      isGestureActive = false
    }
  }

  const handleTouchEnd = (): void => {
    isGestureActive = false
    touchStartY = 0
  }

  const handleOverlayClick = (): void => hide()
  const handleDragHandleClick = (): void => toggle()
  const handleHideButtonClick = (): void => hide()

  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
  overlayEl.addEventListener('click', handleOverlayClick)
  dragHandleEl.addEventListener('click', handleDragHandleClick)

  if (hideButtonEl) {
    hideButtonEl.addEventListener('click', handleHideButtonClick)
  }

  const destroy = (): void => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    overlayEl.removeEventListener('click', handleOverlayClick)
    dragHandleEl.removeEventListener('click', handleDragHandleClick)
    if (hideButtonEl) {
      hideButtonEl.removeEventListener('click', handleHideButtonClick)
    }
    document.body.style.overflow = ''
  }

  return { show, hide, toggle, setContent, destroy }
}

// ==================== INIT ====================
const bottomSheet = createBottomSheet({
  sheetId: 'bottomSheet',
  overlayId: 'overlay',
  contentId: 'sheetContent',
  dragHandleId: 'dragHandle',
  hideButtonId: 'hide-console',
  swipeThresholdPx: 30,
  bottomEdgeTriggerPx: 10,
})