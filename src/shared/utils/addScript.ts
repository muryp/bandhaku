type ScriptFn = () => void

const scripts: ScriptFn[] = []

export const addScript = (fn: ScriptFn) => scripts.push(fn)

export const executeScripts = () => {
  if (scripts.length > 0) {
    scripts.forEach((fn) => fn())
    scripts.length = 0
  }
}
