const rule = require('../../../lib/rules/import-order')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } });
ruleTester.run('import-order', rule, {
  valid: [
    `
    import x from 'a'
    import s from 'b'
    import { something } from 'c'
    `,  
    `
    import x from 'a'
    import { something, more } from 'c'
    import { somethingElse } from 'c'
    `  
  ],

  invalid: [
    {
      code: 
        `
        import x from 'c'
        import { something, more } from 'b'
        import { somethingElse } from 'c'
        `  
      ,
      errors: [ { message: 'sort your imports!' } ]
    }
  ]
});
