(function( w, $ ){
  "use strict";

  var name = "autocomplete";

  w.componentNamespace = w.componentNamespace || {};

  var AutoComplete = w.componentNamespace.AutoComplete = function( element, menu, url ){
    // assign element for method events
    this.$element = this.$input = $( element );

    if( this.$input.data("autocomplete-component") ){
      return;
    }

    this.menu = menu;
    this.ignoreKeycodes = [];

    // TODO it might be better to push this into the constructor of the menu to
    //      reduce dependency on the structure of the menu's keybinding reresentation
    $.each(menu.keycodes, $.proxy(function( key, value ){
      this.ignoreKeycodes.push( parseInt(key, 10) );
    }, this));

    this.url = url;

    this.$input.data( "autocomplete-component", this );
    this.$input.attr( "autocomplete", "off" );

    this.$form = this.$input.parents( "form" );
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
        this.strip( this.val(value) );
      }
    }
  };

  AutoComplete.prototype.select = function( e ) {
    this.val( this.strip(this.menu.selectActive() || "") );
  };

  AutoComplete.prototype.suggest = function( e ){
    if( e && e.keyCode && this.ignoreKeycodes.indexOf(e.keyCode) != -1 ){
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

    this._suggestPromise = this.fetch();

    return this._suggestPromise.done($.proxy( this, "render" ));
  };

  AutoComplete.prototype.abortFetch = function() {
    // if suggest is called many times we want to use that last
    // NOTE ajax doesn't return a normal deferred so I couldn't find a way to reject
    if( this._suggestPromise && this._suggestPromise.abort ) {
      this._suggestPromise.abort();
    }
  };

  AutoComplete.prototype.fetch = function() {
    return $.ajax({
      dataType: "json",
      url: this.url,
      data: {
        q: this.val().toLowerCase()
      }
    });
  };

  // TODO this whole method is KJ specific due to returned json
  //      set this up so that render can be replaced or at least
  //      the data manip can be parameterized
  AutoComplete.prototype.render = function( data ) {
    var data = data.location || data;

    if( data.length ) {
      this.menu.fill(data);
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
    return $.trim( string );
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
})( this, jQuery );
