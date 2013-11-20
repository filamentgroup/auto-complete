Component
=========

Just a simple auto-enhance-able component skeleton. It's not a widget factory, just for simple stuff. 

Start by setting the `componentName` var to whatever the class name of your component happens to be (wihtout the `.`). Then drop your typical logic into the each statement.

The script will auto-initialize your component whenever an `enhance` event is triggered on a parent element. 

We typically add this to kick things off when the DOM is ready:

``` js
$( function(){ $( document ).trigger( "enhance" ); } );  
```

 ...and then trigger `enhance` on newly appended markup as well.
