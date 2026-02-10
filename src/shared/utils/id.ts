let idCounter = 0
let staticID: number

export function $id() {
  idCounter++
  console.log(idCounter)
  const currentId = idCounter.toString()

  /**
   * Action akan mencari semua elemen dengan data-id yang sesuai.
   * Callback (fn) akan dieksekusi untuk SETIAP elemen yang ditemukan.
   * Developer selalu menerima element tunggal sebagai argumen.
   */
  const action = <T extends HTMLElement = HTMLElement>(fn: (el: T) => void) => {
    const nodes = document.querySelectorAll(`[data-id="${currentId}"]`)

    // Internal loop: menjalankan callback satu per satu untuk tiap node
    nodes.forEach((node) => fn(node as T))
  }

  return [`data-id="${currentId}"`, action] as const
}

export function resetId() {
  if (staticID) {
    idCounter = staticID
  }
}
export function staticId() {
  staticID = idCounter
}