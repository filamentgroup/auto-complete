# Auto-complete

A bare-bones auto-complete component which currently depends on jQuery.

## Dependencies

1. jQuery (see TODO)
2. [Menu](https://github.com/filamentgroup/menu)

## Setup

Use the following includes to setup the init on enhance:

```html
<script src="lib/jquery.js"></script>
<script src="lib/menu.js"></script>
<script src="src/core.js"></script>
<!-- optional if you're not using a DOM source for data -->
<script src="src/dom.js"></script>
<script src="src/init.js"></script>
<link rel="stylesheet" href="/lib/menu.css">
```

Typically the enhancement is triggered on DOM ready and when subsequent markup is added to the page:

``` js
$( function(){ $( document ).trigger( "enhance" ); } );
```

## TODO

1. More tests
2. Remove jQuery dependency

<a name="AUTO-complete"></a>
## AUTO-complete

Just a bit of fun:

We define a class of languages AUTO, such that L is in AUTO if there exists a Turing machine M and an oracle O where M can write its input on the oracle tape and respond directly with the oracle's answer in a single query.

**Theorem.** *The auto-complete component is AUTO-complete*

**Proof.** This follows directly from the observation that the component takes as one of its parameters the "URL" for the oracle which it will consult which ensures that it will always have a sufficiently powerful oracle to answer queries in a single round for any language in AUTO. ∎
