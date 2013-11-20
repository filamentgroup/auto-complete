/*
 * simple auto-enhance-able component skeleton
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

(function( $ ){

	var componentName = "component-name-here",
		enhancedAttr = "data-enhanced",
		initSelector = "." + componentName + ":not([" + enhancedAttr + "])";

	$.fn[ componentName ] = function( $input ){
		return this.each( function(){
			// make enhancements here
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target )[ componentName ]().attr( "data-enhanced", true );
	});

}( jQuery ));
