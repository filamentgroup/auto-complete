/*
 * simple auto-enhance component skeleton
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

(function( $ ){

	var pluginName = "plugin-name-here",
		enhancedAttr = "data-enhanced",
		initSelector = "." + pluginName + ":not([" + enhancedAttr + "])";

	$.fn[ pluginName ] = function( $input ){
		return this.each( function(){
			// make enhancements here
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target )[ pluginName ]().attr( "data-enhanced", true );
	});

}( jQuery ));
