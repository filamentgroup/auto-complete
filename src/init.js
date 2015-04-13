(function( w, $ ){
  "use strict";

  $.fn.autocomplete = function(){
    return this.each(function(){
      var $this, autocomplete, menu, $menu;

      $this = $(this);

      if( $this.data( "autocomplete-component" ) ){
        return;
      }

      $menu = $this.parent().find( "[data-menu]" ).eq( 0 );

      menu = $menu.data( 'Menu' );

      if( !menu ) {
        menu = new w.componentNamespace.Menu( $menu[0] );
      }

      if( $this.is("[data-autocomplete]") ){
        autocomplete = new w.componentNamespace.AutoComplete( this, menu );
      } else {
        autocomplete = new w.componentNamespace.AutoCompleteDom( this, menu );

        autocomplete.$domSource.on( "change", function() {
          var $this, text;

          $this = $(this);
          text = $this.find( "[value='" + $this.val() + "']" ).text();
          autocomplete.val( text );
        });
      }

      $this.on( "keyup", $.proxy(autocomplete.suggest, autocomplete) );
      $this.on( "keydown", $.proxy(autocomplete.navigate, autocomplete) );

      menu.$element.on( "mouseup", $.proxy(autocomplete.select, autocomplete) );

      menu.init();
    });
  };

  $( w.document ).on( "enhance", function(){
    $( "[data-autocomplete], [data-autocomplete-dom]" ).autocomplete();
  });
})( this, this.jQuery);
