(function( w, $ ){
	"use strict";

	var AutoCompleteAjaxHtml = function( element, menu ){
		w.componentNamespace.AutoComplete.call( this, element, menu );

		this.url = this.$input.attr("data-autocomplete-ajax-html");
		this.selector = this.$input.attr("data-filter-selector");
		this.valueSelector = this.$input.attr("data-value-selector");
	};

	w.componentNamespace.AutoCompleteAjaxHtml = AutoCompleteAjaxHtml;
	$.extend(AutoCompleteAjaxHtml.prototype, w.componentNamespace.AutoComplete.prototype);

	AutoCompleteAjaxHtml.prototype.getItemText = function( $elem ) {
		if( this.valueSelector ){
				return $elem.find( this.valueSelector ).text();
		}
		else {
			return $elem.text();
		}
	};

	AutoCompleteAjaxHtml.prototype.compareDataItem = function( $elem, val ) {
		if( !val ) {
			return false;
		}
		// simple substring match
		return this.getItemText( $elem ).toLowerCase().indexOf( val ) !== -1;
	};

	AutoCompleteAjaxHtml.prototype.fetch = function( request, callback ) {
		var value = this.$input.val().toLowerCase();
		var self = this;

		$.ajax(this.url, {
			dataType: "html",

			data: {
				q: this.val().toLowerCase()
			},

			success: function( data ) {
				var keep = [];
				var $el = $( "<div/>" ).html( data );
				$el.find( self.selector ).each(function( i, elem ){
					var $elem = $( elem );
					if( !this.isFiltered || self.compareDataItem( $elem, value ) ) {
						keep.push( $elem );
					}
				});
				callback( keep );
			}
		});
	};

	AutoCompleteAjaxHtml.prototype.fill = function( data ) {
		var items = this.filterData( data );
		var selectedText = this.menu.getSelectedElement().text();
		var self = this;
		this.menu.$element.removeAttr( "role" );
		this.menu.$element.removeAttr( "aria-hidden" );
		var $list = this.menu.$element.find( "ol,ul" );
		$list.html("");


		$.each( items, function( i, item ){
			var $li = $( "<li/>" );
			//$li.attr( "tabindex", "-1" );
			//$li.attr( "role", "option" );

			if( self.compareDataItem( item, selectedText ) ) {
				$li.addClass( "menu-selected" );
			}
			$li.append( item );
			$list.append( $li );
		});
	};

	AutoCompleteAjaxHtml.prototype.val = function( str ) {
		// ignore str, use the filtered methods
		var $selected;
		var value;
		if( str ) {
			$selected = this.menu.getSelectedElement();
			if( $selected.length ) {
				value = this.strip( this.getItemText( $selected ) );
			}
			this.$input.trigger( "autocomplete:set", { value: value } );
			this.$input.val( value );
		} else {
			return this.$input.val();
		}
	};

	AutoCompleteAjaxHtml.prototype.select = function() {
		this.val( this.menu.selectActive() );
	};
})(this, this.jQuery);
