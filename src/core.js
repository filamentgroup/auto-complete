(function( w, $ ){
  "use strict";

  var name = "autocomplete";

  w.componentNamespace = w.componentNamespace || {};

  $.proxy = $.proxy || function(fn, context) {
    return function() {
      return fn.apply(context, arguments);
    };
  };

  var AutoComplete = w.componentNamespace.AutoComplete = function( element, menu ){
    // assign element for method events
    this.$element = this.$input = $( element );

    if( this.$input.data("autocomplete-component") ){
      return;
    }

    this.menu = menu;
    this.ignoreKeycodes = [];

    // TODO it might be better to push this into the constructor of the menu to
    //      reduce dependency on the structure of the menu's keybinding reresentation
    $.each(menu.keycodes, $.proxy(function( key ){
      this.ignoreKeycodes.push( parseInt(key, 10) );
    }, this));

    this.url = this.$element.attr( "data-autocomplete" );

    this.$input.data( "autocomplete-component", this );
    this.$input.attr( "autocomplete", "off" );
    this.isFiltered = !this.$input.is( "[data-unfiltered]" );
    this.isCaseSensitive = this.$input.is( "[data-case-sensitive]" );

    this.$form = this.$input.parents( "form" );

    this._requestId = 0;
  };

  AutoComplete.preventSubmitTimeout = 200;

  // TODO tightly coupled to the notion of keypresses
  AutoComplete.prototype.navigate = function( event ){
    var value;

    if( this.menu.isOpen() ){
      // Prevent the submit after a keydown for 200ms to avoid submission after hitting
      // enter to select a autocomplete menu item
      this.preventSubmit();
      value = this.menu.keyDown(event);

      if( value ){
        this.val( this.strip(value) );
      }
    }
  };

  AutoComplete.prototype.select = function() {
    this.val( this.strip(this.menu.selectActive() || "") );
  };

  AutoComplete.prototype.filterData = function(data){
    if( !data.length ) {
      return;
    }
    var val = this.val();
    var compare;
    if( !this.isCaseSensitive ) {
      val = val.toLowerCase();
    }
    var filtered = [];
    for( var j = 0, k = data.length; j < k; j++ ) {
      compare = !this.isCaseSensitive ? data[ j ].toLowerCase() : data[ j ];
      if( compare.indexOf( val ) === 0 ) {
        filtered.push( data[ j ] );
      }
    }
    return filtered;
  };

  AutoComplete.prototype.suggest = function( e ){
    if( e && e.keyCode && this.ignoreKeycodes.indexOf(e.keyCode) !== -1 ){
      return;
    }

    // if at any point the suggest is requested with an empty input val
    // stop everything and hide the suggestions.
    if( !this.$input.val() ){
      this.abortFetch();
      this.hideSuggest();
      return;
    }

    this.abortFetch();

    var request = this._requestId += 1;

    this.fetch($.proxy(function( data ) {
      // we have made another request, ignore this one
      if( request !== this._requestId ) {
        return;
      }

      this.render(typeof data === "string" ? JSON.parse(data): data);
    }, this));
  };

  AutoComplete.prototype.abortFetch = function() {
    // invalidate the current request value by incrementing the counter
    this._requestId += 1;

    this.$input.trigger( name + ":aborted" );
  };

  AutoComplete.prototype.fetch = function( success ) {
    $.ajax(this.url, {
      dataType: "json",

      data: {
        q: this.val().toLowerCase()
      },

      success: success
    });
  };

  // TODO this whole method is KJ specific due to returned json
  //      set this up so that render can be replaced or at least
  //      the data manip can be parameterized
  AutoComplete.prototype.render = function( data ) {
    data = data.location || data;
    if( data.length ) {
      this.menu.fill(this.filterData(data), this.menu.getSelectedElement().text());
      this.showSuggest();
    }

    this.$input.trigger( name + ":suggested" );
  };

  AutoComplete.prototype.showSuggest = function() {
    this._isSuggestShown = true;
    this.menu.open();
    this.$input.trigger( name + ":shown" );
  };

  AutoComplete.prototype.hideSuggest = function() {
    this._isSuggestShown = false;
    this.menu.close();
    this.$input.trigger( name + ":hidden" );
  };

  // TODO remove
  AutoComplete.prototype.strip = function( string ) {
    return string.replace(/^\s+|\s+$/g, '');
  };

  AutoComplete.prototype.val = function( str ) {
    var value;
    if( str ) {
      value = this.strip(str);
      this.$input.trigger( name + ":set", { value: value } );
      this.$input.val( value );
    } else {
      return this.$input.val();
    }
  };

  AutoComplete.prototype.preventSubmit = function(){
    this.$form.one( "submit.autocomplete", function( event ){
      event.preventDefault();
    });

    clearTimeout(this.preventedSubmitTimeout);

    this.preventedSubmitTimout = setTimeout($.proxy(function() {
      this.$form.off( "submit.autocomplete" );
    }, this), AutoComplete.submitPreventTimeout);
  };
})( this, this.jQuery );
