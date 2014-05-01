(function( $, window ) {
  var $doc, $instance, instance, promise, commonSetup, commonTeardown;

  $doc = $( document );

  commonSetup = function() {
    $instance = $( "[data-autocomplete]" );

    $instance.autocomplete();
    instance = $instance.data( "autocomplete-component" );
    promise = $.Deferred();

    instance.fetch = function() {
      return promise;
    };

    promise.abort = function() {
      this.reject();
    };
  };

  commonTeardown = function() {
    $instance.unbind( "autocomplete:suggested" )
      .unbind( "autocomplete:shown" )
      .unbind( "autocomplete:hidden" );
  };

  module( "suggest", {
    setup: commonSetup,
    teardown: commonTeardown
  });

  asyncTest( "abort and hide called when input empty", function() {
    expect( 2 );

    $instance.val( "" );

    promise.fail(function() {
      ok( true, "called" );
    });

    instance._suggestPromise = promise;

    $instance.one( "autocomplete:hidden", function(){
      ok( true, "called" );
      start();
    });

    instance.suggest();
  });

  asyncTest( "aborts previous fetches", function() {
    expect( 1 );

    $instance.val( "foo" );

    promise.fail(function() {
      ok( true, "called" );
      start();
    });

    instance._suggestPromise = promise;
    instance.suggest();
  });

  asyncTest( "shows output on fetch completion", function() {
    expect( 1 );

    $instance.val( "foo" );

    promise.done(function() {
      ok( true, "called" );
      start();
    });

    instance.suggest().resolve( [] );
  });
})( jQuery, this );
