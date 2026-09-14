import ts from 'typescript'
import type { Plugin } from 'vite'

export default function detectAddScriptUsesId(): Plugin {
  return {
    name: 'detect-addscript-uses-id',
    transform(code, id) {
      if (!id.match(/\.[jt]sx?$/)) return

      const sourceFile = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true)
      const checker = ts.createProgram([id], {}).getTypeChecker() // optional kalau butuh type
      const idVariables = new Set<string>() // nyimpen nama variable hasil $id()

      function visit(node: ts.Node) {
        // 1. Track: const [xxx, containerAction] = $id()
        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach(decl => {
            if (
              ts.isArrayBindingPattern(decl.name) &&
              decl.initializer &&
              ts.isCallExpression(decl.initializer) &&
              ts.isIdentifier(decl.initializer.expression) &&
              decl.initializer.expression.text === '$id'
            ) {
              // Ambil semua nama variable di destructuring: [containerId, containerAction]
              decl.name.elements.forEach(el => {
                if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) {
                  idVariables.add(el.name.text)
                }
              })
            }
          })
        }

        // 2. Cek addScript(...)
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'addScript'
        ) {
          let usesIdVar = false

          // Traverse semua node di dalam arguments addScript
          function checkForIdUsage(n: ts.Node) {
            if (ts.isIdentifier(n) && idVariables.has(n.text)) {
              usesIdVar = true
            }
            ts.forEachChild(n, checkForIdUsage)
          }

          node.arguments.forEach(arg => checkForIdUsage(arg))

          if (usesIdVar) {
            const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart())
            console.log(`[addScript] di ${id}:${pos.line + 1} pakai variable dari $id()`)
          } else {
            const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart())
            console.log(`[addScript] di ${id}:${pos.line + 1} TIDAK pakai $id`)
          }
        }

        ts.forEachChild(node, visit)
      }

      ts.forEachChild(sourceFile, visit)
      return null
    }
  }
}