(function( w, $ ){
  "use strict";

  var name = "autocomplete";

  w.componentNamespace = w.componentNamespace || {};

  $.proxy = $.proxy || function(fn, context) {
    return function() {
      return fn.apply(context, arguments);
    };
  };

  var AutoComplete = function( element, menu ){
    // assign element for method events
    this.$element = this.$input = $( element );

    if( this.$input.data("autocomplete-component") ){
      return;
    }

    this.ignoreKeycodes = [];
    this.idNum = new Date().getTime();

    // menu ID for aria-owns
    this.menu = menu;
    this.menuID = this.menu.$element.attr( "id" ) || "autocomplete-menu-" + this.idNum;
    this.menu.$element.attr( "id", this.menuID );
    this.menu.$element.removeAttr( "role" );
    this.menu.$element.find( "ol" ).attr( "role", "listbox" );

    // TODO it might be better to push this into the constructor of the menu to
    //      reduce dependency on the structure of the menu's keybinding reresentation
    for( var key in menu.keycodes ) {
      this.ignoreKeycodes.push( parseInt( key, 10 ) );
    }

    // make sure tab key does not rove focus within the menu
    delete menu.keycodes[ "9" ];


    this.url = this.$element.attr( "data-autocomplete" );

    this.$input.data( "autocomplete-component", this );
    this.$input.attr( "autocomplete", "off" );
    this.$input.attr( "spellcheck", "off" );
    this.$input.attr( "autocorrect", "off" );
    this.$input.attr( "autocapitalize", "off" );

    this.$input.attr( "aria-autocomplete", "list" );
    this.$input.attr( "aria-owns", this.menuID );

    this.inputID = this.$input.attr( "id" ) || "autocomplete-" + this.idNum;
    if( !this.inputID ){
      this.$input.attr( "id", this.inputID );
    }

    // helper span for usage description
    this.helpText = this.$input.attr( "data-autocomplete-helptext" ) || "";
    this.helpTextID = "autocomplete-helptext-" + this.idNum;
    this.$helpSpan = $( '<span id="' + this.helpTextID + '" class="autocomplete-helptext a11y-only">' + this.helpText + '</span>' ).insertBefore( this.$input );
    this.$input.attr( "aria-describedby", this.helpTextID );

    this.spokenValue = this.$input.val();
    this.spokenValueID = "autocomplete-spokenvalue-" + this.idNum;
    this.$helpSpan = $( '<span id="' + this.spokenValueID + '" class="autocomplete-spokenvalue a11y-only" aria-live="assertive"></span>' ).insertBefore( this.$input );



    // TODO move to options object
    this.isFiltered = !this.$input.is( "[data-unfiltered]" );
    this.isCaseSensitive = this.$input.is( "[data-case-sensitive]" );
    this.isBestMatch = this.$input.is( "[data-best-match]" );
    this.isEmptyNoMatch = this.$input.is( "[data-empty-no-match]" );

    this.$form = this.$input.parents( "form" );

    this._requestId = 0;

    this.matches = [];
  };

  w.componentNamespace.AutoComplete = AutoComplete;

  AutoComplete.preventSubmitTimeout = 200;
  AutoComplete.ajaxDelayTimeout = 100;

  AutoComplete.prototype.refreshHelpSpan = function( value ){
    this.$helpSpan.html( "" );
    this.$helpSpan.attr( "aria-live", "" );
    this.$helpSpan.html( value );
    this.$helpSpan.attr( "aria-live", "assertive" );
  };

  AutoComplete.prototype.blur = function() {
    // use the best match when there is one
    if( this.isBestMatch && this.matches[0] ){
      this.$input.val( this.matches[0] );
    }

    // empty the field when there are no matches
    if( this.isEmptyNoMatch && !this.matches[0] ){
      this.$input.val("");
    }
  };

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
      else{
      this.refreshHelpSpan( this.menu.getSelectedElement().text() );
    }
    }
  };

  AutoComplete.prototype.select = function() {
    this.val( this.strip(this.menu.selectActive() || "") );
  };

  AutoComplete.prototype.compareDataItem = function(item, val){
    var compare = !this.isCaseSensitive ? item.toLowerCase() : item;

    return compare.indexOf( val ) === 0;
  };

  AutoComplete.prototype.filterData = function( data ){
    if( !data.length ) {
      return;
    }
    if( !this.isFiltered ) {
      return data;
    }
    var val = this.val();
    if( !this.isCaseSensitive ) {
      val = val.toLowerCase();
    }

    var filtered = [];
    for( var j = 0, k = data.length; j < k; j++ ) {
      if( this.compareDataItem( data[ j ], val ) ) {
        filtered.push( data[ j ] );
      }
    }

    return filtered;
  };

  AutoComplete.prototype.suggest = function( e ){
    if( e && e.keyCode && this.ignoreKeycodes.indexOf(e.keyCode) !== -1 ){
      return;
    }

    // before we start rendering, lets just check that the user hasn't
    // stopped everything and hide the suggestions if necessary
    if( !this.$input.val() ){
      this.abortFetch(true);
      return;
    }

    var request = ++this._requestId;

    // let the request stack unwind so that other key presses can
    // proceed to update the request id and thereby cancel this request
    setTimeout($.proxy(function(){
      this.fetch(request, $.proxy(function( data ) {
        this.render(request, typeof data === "string" ? JSON.parse(data): data);
      }, this));
    }, this), AutoComplete.ajaxDelayTimeout);
  };

  AutoComplete.prototype.abortFetch = function(skip) {
    if(skip) { this._requestId++; }

    // on abort we should hide the menu if the input value is empty
    if( !this.$input.val() ){
      this.hideSuggest();
    }

    this.$input.trigger( name + ":aborted" );
  };

  AutoComplete.prototype.fetch = function( request, success ) {
    // the user has changed the request since the suggest method was called so
    // we should ignore this, old request
    if( request !== this._requestId ) {
      this.abortFetch();
      return;
    }

    $.ajax(this.url, {
      dataType: "json",

      data: {
        q: this.val().toLowerCase()
      },

      success: success
    });
  };

  AutoComplete.prototype.fill = function( data ) {
    this.menu.fill( this.filterData(data), this.menu.getSelectedElement().text() );
  };

  // TODO this whole method is project specific due to returned json
  //      set this up so that render can be replaced or at least
  //      the data manip can be parameterized
  AutoComplete.prototype.render = function( request, data ) {
    // the user has changed the request since the suggest method was called so
    // we should ignore this, old request
    if( request !== this._requestId ) {
      this.abortFetch();
      return;
    }

    data = data.location || data;

    this.matches = data;

    if( data.length ) {
      this.fill( data );
      this.showSuggest();
    } else {
      this.hideSuggest();
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
      this.refreshHelpSpan( "Selected " + value );

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
