type ScriptFn = () => void

const scripts: ScriptFn[] = []

export const addScript = (fn: ScriptFn) => scripts.push(fn)

export const executeScripts = () => {
  scripts.forEach((fn) => fn())
  scripts.length = 0
}
