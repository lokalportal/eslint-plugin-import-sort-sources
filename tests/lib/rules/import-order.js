const rule = require('../../../lib/rules/import-order')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester();
ruleTester.run('import-order', rule, {
  valid: [
    'var validExample;',
    'for(;;) {}',
    'do {} while(condition)'
  ],

  invalid: [
    {
      code: 'while(condition) {}',
      errors: [ { messageId: 'avoidWhileLoops' } ]
    }
  ]
});
