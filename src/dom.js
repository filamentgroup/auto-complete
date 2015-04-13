(function( w, $ ){
  "use strict";

  var AutoCompleteDom = function( element, menu ){
    w.componentNamespace.AutoComplete.call( this, element, menu );
    this.$domSource = $( this.$input.attr("data-autocomplete-dom") );
  };

  w.componentNamespace.AutoCompleteDom = AutoCompleteDom;
  $.extend(AutoCompleteDom.prototype, w.componentNamespace.AutoComplete.prototype);

  AutoCompleteDom.prototype.fetch = function( callback ){
    var value = this.$input.val().toLowerCase(), keep = [];

    this.$domSource.children().each($.proxy(function( i, elem ){
      var text = $(elem).text();

      // simple substring match
      if( text.toLowerCase().indexOf( value ) !== -1 ){
        keep.push(this.strip(text));
      }
    }, this));

    callback( keep );
  };
})(this, this.jQuery);
