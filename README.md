html-prefixer
============
prefix class names and IDs (optionally) in html strings

how to use

```js
var prefixer = require('html-prefixer')

var html = '<div id="container"><span onclick=foo class="sdsd test-texg test"></span></div>';
prefixer(html,
          {prefix:'test-', ignore:['test'], prefixIds: true})
  .then(function(val){
    console.log(val)
    // => <div id="test-container"><span onclick=foo class="sdsd test-texg test"></span></div>
  })
  .fail(function(err){
    console.log(err)
    // = > Error
  })

```

Notes:
- pull requests are welcome
- better docs to come
