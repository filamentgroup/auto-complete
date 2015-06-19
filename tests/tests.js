(function( $, window ) {
  var $doc, $instance, instance, promise, commonSetup, commonTeardown, config;

  $doc = $( document );

  commonSetup = function() {
    $instance = $( "[data-autocomplete]" );

    $instance.autocomplete();
    instance = $instance.data( "autocomplete-component" );
  };

  commonTeardown = function() {
    $instance.unbind( "autocomplete:suggested" )
      .unbind( "autocomplete:shown" )
      .unbind( "autocomplete:hidden" );
  };

  module( "auto-complete", config = {
    setup: commonSetup,
    teardown: commonTeardown
  });

  asyncTest( "abort and hide called when input empty", function() {
    expect( 2 );

    $instance.val( "" );

    $instance.one("autocomplete:aborted", function() {
      ok( true, "called" );
    });

    $instance.one( "autocomplete:hidden", function(){
      ok( true, "called" );
      start();
    });

    instance.suggest();
  });

  asyncTest( "aborts previous fetches", function() {
    expect( 1 );

    $instance.one("autocomplete:aborted", function() {
      ok( true, "called" );
      start()
    });

    $instance.val( "foo" );
    instance.suggest();
    $instance.val( "fooz" );
    instance.suggest();
  });

  test( "value is assigned, stripped from menu keydown", function() {
    expect( 1 );

    instance.menu.isOpen = function() {
      return true;
    };

    instance.menu.keyDown = function() {
      return "  foo    ";
    };

    instance.val = function( value ) {
      equal( value, "foo" );
    };

    instance.navigate();
  });

  test( "menu selected item is stripped and assigned", function() {
    expect( 1 );

    instance.menu.selectActive = function() {
      return "   foo    ";
    };

    instance.val = function( value ) {
      equal( value, "foo" );
    };

    instance.select();
  });

  module( "render", config );

  test( "populates and shows the menu", function() {
    instance.render( [ "foo", "bar" ] );

    // visible
    ok( instance.menu.$element.is("[aria-hidden='false']") );

    var $menuItems = instance.menu.$element.find("li");
    equal( $menuItems.length, 2 );
    equal( $menuItems.eq( 0 ).text(), "foo" );
    equal( $menuItems.eq( 1 ).text(), "bar" );
  });

  test( "filters non-matches by default", function() {
    instance.$element.val( "foo" );
    instance.render( [ "foo", "bar" ] );

    var $menuItems = instance.menu.$element.find("li");
    equal( $menuItems.length, 1 );
    equal( $menuItems.eq( 0 ).text(), "foo" );
  });

  test( "case insensitive by default", function() {
    instance.$element.val( "Foo" );
    instance.render( [ "foo", "bar" ] );

    var $menuItems = instance.menu.$element.find("li");
    equal( $menuItems.eq( 0 ).text(), "foo" );
  });

  asyncTest( "triggers the suggested event", function() {
    expect( 1 );

    $doc.on( "autocomplete:suggested", function() {
      ok( true );
      start();
    });

    instance.render( [ "foo", "bar" ] );
  });

  module( "showSuggest", config );

  test( "opens menu", function() {
    expect( 1 );

    instance.menu.open = function() {
      ok( true );
    };

    instance.showSuggest();
  });

  asyncTest( "triggers shown event", function() {
    expect( 1 );

    $doc.on( "autocomplete:shown", function() {
      ok( true );
      start();
    });

    instance.showSuggest();
  });

  module( "hideSuggest", config );

  test( "closes menu", function() {
    expect( 1 );

    instance.menu.close = function() {
      ok( true );
    };

    instance.hideSuggest();
  });

  asyncTest( "triggers hidden event", function() {
    expect( 1 );

    $doc.on( "autocomplete:hidden", function() {
      ok( true );
      start();
    });

    instance.hideSuggest();
  });

  module( "val", config );

  test( "returns value with no formal param", function() {
    instance.$element.val( "baz" );

    equal( instance.val(), "baz" );
  });

  test( "sets value with formal param", function() {
    instance.$element.val( "bak" );

    equal( instance.val(), "bak" );

    instance.val( "bag" );

    equal( instance.val(), "bag" );
  });
})( jQuery, this );
