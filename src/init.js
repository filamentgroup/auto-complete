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
      } else if( $this.is("[data-autocomplete-ajax-html]") ){
        autocomplete = new w.componentNamespace.AutoCompleteAjaxHtml( this, menu );
      } else {
        autocomplete = new w.componentNamespace.AutoCompleteDom( this, menu );

        // if the form value on the data source changes, update the autocomplete input
        autocomplete.$domSource.on( "change", function() {
          var $this, text;

          $this = $(this);
          text = $this.find( "[value='" + $this.val() + "']" ).text();
          autocomplete.val( text );
        });
      }

      $this.on( "keyup", $.proxy(autocomplete.suggest, autocomplete) );
      $this.on( "keydown", $.proxy(autocomplete.navigate, autocomplete) );
      $this.on( "blur", $.proxy(autocomplete.blur, autocomplete) );

      // NOTE we can't close on `mouseup` in case there's overflow scrolling
      // because the `mouseup` event is fired when using the scrollbar
      menu.$element.on( "click", $.proxy(autocomplete.select, autocomplete) );

      menu.init();
    });
  };

  $( w.document ).on( "enhance", function(){
    $( "[data-autocomplete], [data-autocomplete-dom], [data-autocomplete-ajax-html]" ).autocomplete();
  });
})( this, this.jQuery);
