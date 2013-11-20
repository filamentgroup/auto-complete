component
=========

just our typical auto enhance-able component skeleton


This will make a plugin that auto-initializes whenever a `enhance` event is triggered on a parent element. 

``` js
$( function(){ $( document ).trigger( "enhance" ); } );  
```

We typically add this to kick things off, then trigger `enhance` on newly appended markup as well.
