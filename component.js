/*
 * simple auto-enhance-able component skeleton
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

(function( $ ){

	var componentName = "component-name-here",
		enhancedAttr = "data-enhanced",
		initSelector = "." + componentName + ":not([" + enhancedAttr + "])";

	$.fn[ componentName ] = function(){
		return this.each( function(){
			// make enhancements here
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		var $sel = $( e.target ).is( initSelector ) ? $( e.target ) : $( initSelector, e.target );
		$sel[ componentName ]().attr( enhancedAttr, "true" );
	});

}( jQuery ));
