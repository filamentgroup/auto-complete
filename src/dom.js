(function( w, $ ){
  "use strict";

  var name = "autocomplete";

  var AutoCompleteDom = function( element, menu ){
    w.componentNamespace.AutoComplete.call( this, element, menu );
    this.$domSource = $( this.$input.attr("data-autocomplete-dom") );
  };

  w.componentNamespace.AutoCompleteDom = AutoCompleteDom;
  $.extend(AutoCompleteDom.prototype, w.componentNamespace.AutoComplete.prototype);

  AutoCompleteDom.prototype.fetch = function(){
    var deferred = $.Deferred(), value = this.$input.val().toLowerCase();

    return deferred.resolve(this.$domSource.children().map($.proxy(function( i, elem ){
      var text = $(elem).text();

      // simple substring match
      return text.toLowerCase().indexOf( value ) != -1 ? this.strip(text) : undefined;
    }, this)));
  };
})(this, jQuery);
