# Auto-complete

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

A lightweight auto-complete that can be populated via JSON or by DOM element text.

![Build status](https://api.travis-ci.org/filamentgroup/auto-complete.svg)

## Dependencies

1. jQuery or Shoestring
2. [Menu](https://github.com/filamentgroup/menu)

## Setup

Use the following includes to setup the init on enhance:

```html
<script src="lib/shoestring-dev.js"></script>
<script src="lib/menu.js"></script>
<script src="src/core.js"></script>
<!-- optional if you're not using a DOM source for data -->
<script src="src/dom.js"></script>
<script src="src/init.js"></script>
<link rel="stylesheet" href="/lib/menu.css">
```

Typically the enhancement is triggered on DOM ready and when subsequent markup is added to the page:

``` js
$( function(){ $(document).trigger("enhance"); } );
```

## Options

* `data-best-match`, if the input has this attribute, on blur, the first match in the current suggested matches will be used to populate the input.

## Examples:

See the [demo page](http://filamentgroup.github.io/auto-complete/) for examples.

## Custom Comparison Logic

The existing comparison (which is just a substring check) might be too simple. In this case you can replace the `compareDataItem` definition on the `AutoComplete` prototype to get the desired custom comparison functionality. For example if you wanted to consult another part of the DOM (eg an input) for information that might inform the filtering of auto complete data you might do the following:

```javascript
// data : String, a data item from the auto-complete data source (DOM or Ajax Req)
// val : String, the value of the auto-complete input
w.componentNamespace.AutoComplete.prototype.compareDataItem = function(data, val){
  // get the extra constraint information from the DOM
  var otherConstraint = $( ".some-input").val();
  
  // check if the value from the other input is a substring of the auto-complete data
  // check if the value from the autocomplete input is a substring of the auto-complete data
  // return true if both constraints are satsified
  return data.indexOf(otherConstraint) > -1 && data.indexOf(val) > -1;
}
```

As long this definition is executed after the auto-complete library is loaded/executed then this new method definition will determine the logic that plugin uses to filter the incomeing auto-complete data.

**NOTE** that the component namespace is often defined per-project. If you have defined that to be something other than `componentNamespace` which is the default, you'll need to substitute that here.

## AUTO-complete

Just a bit of fun:

We define a class of languages AUTO, such that L is in AUTO if there exists a Turing machine M and an oracle O where M can write its input on the oracle tape and respond directly with the oracle's answer in a single query and L is decided by M.

**Lemma 1.** *The language decided by the auto-complete component is in AUTO.*

Clear from the implementation of the component. ∎

**Lemma 2.** *All languages in AUTO can be reduced in polynomial time to the language decided by auto-complete.*

Follows directly from the observation that the component takes as one of its parameters the "URL" for the oracle which it will consult. As a result we can always simulate the Turing machine for another language in AUTO by taking both the input and the URL for the oracle used in the implementation of the corresponding Turing machine which ensures that it will always have "the right oracle" to answer queries in a single round for any language in AUTO. ∎

**Theorem.** *The language decided by the auto-complete component is AUTO-complete*

By Lemma's 1 and 2. ∎
