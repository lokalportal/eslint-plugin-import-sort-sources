const isLineBeforeEmpty = (node, sourceCode) => !sourceCode.lines[node.loc.start.line - 2].trim();
const isLineBeforeComment = (node, sourceCode) => !!sourceCode.getCommentsBefore(node).length;

module.exports = {
  meta: {
    type: "layout",

    docs: {
        description: "enforces import-order sorted after import sources",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/andresattler/eslint-plugin-import-sort-sources"
    },
    fixable: "code",
    schema: [] // no options
  },

  create: function(context) {
    let prevDeclaration;
    let prevSpecifier;
    const sourceCode = context.getSourceCode();
    return {
      ImportDeclaration(node) {
        if (!prevDeclaration || isLineBeforeEmpty(node, sourceCode) || isLineBeforeComment(node, sourceCode)) {
          prevDeclaration = node;
          prevSpecifier = undefined;
          return;
        }
        if (node.source.value < prevDeclaration.source.value) {
          context.report({
            node,
            message: "sort your imports!",
            fix: fixer => {
              return fixer.replaceTextRange([prevDeclaration.range[0], node.range[1]], sourceCode.getText(node) + "\n" + sourceCode.getText(prevDeclaration));
            }
          });
        }
        prevDeclaration = node;
        prevSpecifier = undefined;
      },
      ImportSpVecifier(node) {
        if (!prevSpecifier) {
          prevSpecifier = node;
          return;
        }
        if (node.imported.name < prevSpecifier.imported.name) {
          context.report({
            node,
            message: "import member not sorted",
            fix: fixer => {
              return fixer.replaceTextRange([prevSpecifier.range[0], node.range[1]], sourceCode.getText(node) + ", " + sourceCode.getText(prevSpecifier));
            }
          });
        }
        prevSpecifier = node;
      }
    }
  };
};
