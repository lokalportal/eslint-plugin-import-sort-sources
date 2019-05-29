const isLineBeforeEmpty = (node, sourceCode) => !sourceCode.lines[node.loc.start.line - 2].trim()
const isLineBeforeComment = (node, sourceCode) => !!sourceCode.getCommentsBefore(node).length

const compare = (a, b) => {
  const isLow = value => {
    return value[0] === "." || value[0] === "/"
  }
  if (isLow(a) && !isLow(b)) {
    return 1
  } else if (!isLow(a) && isLow(b)) {
    return -1
  } else if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  }
  return 0
}

module.exports = {
  meta: {
    type: "layout",

    docs: {
      description: "enforces import-order sorted after import sources",
      category: "Possible Errors",
      recommended: true,
      url: "https://eslint.org/docs/rules/no-extra-semi" // TODO
    },
    fixable: "code",
    schema: [] // no options
  },

  create: function(context) {
    let prevDeclaration
    const sourceCode = context.getSourceCode()
    return {
      ImportDeclaration(node) {
        if (!prevDeclaration || isLineBeforeEmpty(node, sourceCode) || isLineBeforeComment(node, sourceCode)) {
          prevDeclaration = node
          return
        }
        if (compare(node.source.value, prevDeclaration.source.value) === -1) {
          context.report({
            node,
            message: "sort your imports!",
            fix: fixer => {
              return fixer.replaceTextRange(
                [prevDeclaration.range[0], node.range[1]],
                sourceCode.getText(node) + "\n" + sourceCode.getText(prevDeclaration)
              )
            }
          })
        }
        prevDeclaration = node
      }
    }
  }
}
