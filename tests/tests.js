(function( $, window ) {
  var $doc, $instances, $instance, instance, promise, commonSetup, commonTeardown, config;

  $doc = $( document );

  commonSetup = function() {
    $instances = $( "[data-autocomplete], [data-autocomplete-dom]" );

    $instances.autocomplete();
    $instance = $instances.eq( 0 );
    instance = $instance.data( "autocomplete-component" );
  };

  commonTeardown = function() {
    $instances
      .unbind( "autocomplete:suggested" )
      .unbind( "autocomplete:shown" )
      .unbind( "autocomplete:hidden" )
      .unbind( "autocomplete:aborted" );
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
      start();
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

    $doc.one( "autocomplete:suggested", function() {
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

    $doc.one( "autocomplete:shown", function() {
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

    $doc.one( "autocomplete:hidden", function() {
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

  module( "misc", config );

  // Issue #5
  asyncTest( "bestmatch selects first match on blur", function() {
    expect(1);

    var $bestMatch = $( "[data-best-match]" );

    $bestMatch.val( "ba" );

    $bestMatch.one("autocomplete:suggested", function() {
      $bestMatch.trigger( "blur" );

      equal( $bestMatch.val(), "Bar", "value matches" );
      start();
    });

    $bestMatch.trigger( "keyup" );
  });

  asyncTest( "not bestmatch leaves value on blur", function() {
    expect(1);

    var $bestMatch = $( "[data-best-match]" );

    $bestMatch.val( "ba" );

    $bestMatch.data( "autocomplete-component" ).isBestMatch = false;

    $bestMatch.one("autocomplete:suggested", function() {
      $bestMatch.trigger( "blur" );

      equal( $bestMatch.val(), "ba", "value matches" );
      start();
    });

    $bestMatch.trigger( "keyup" );
  });

  asyncTest( "empty-no-match empties the field when no match", function() {
    expect(1);

    var $noMatch = $( "[data-empty-no-match]" );

    $noMatch.val( "bzzz" );

    $noMatch.one("autocomplete:suggested", function() {
      $noMatch.trigger( "blur" );

      equal( $noMatch.val(), "", "value matches" );
      start();
    });

    $noMatch.trigger( "keyup" );
  });

  asyncTest( "not empty-no-match leaves value in field without match", function() {
    expect(1);

    var $noMatch = $( "[data-empty-no-match]" );

    $noMatch.val( "bzzz" );

    $noMatch.data( "autocomplete-component" ).isEmptyNoMatch = false;

    $noMatch.one("autocomplete:suggested", function() {
      $noMatch.trigger( "blur" );

      equal( $noMatch.val(), "bzzz", "value matches" );
      start();
    });

    $noMatch.trigger( "keyup" );
  });

  // Issue #6
  asyncTest( "mismatch hides menu", function() {
    expect(2);

    var $instance = $instances.eq( 1 );
    instance = $instance.data( "autocomplete-component" );

    $instance.one("autocomplete:suggested", function() {
      ok(instance.menu.opened, "menu opened");

      $instance.one("autocomplete:suggested", function() {
        ok(!instance.menu.opened, "menu closed");
      });

      $instance.val( "bz" );
      $instance.trigger( "keyup" );

      start();
    });

    $instance.val( "b" );
    $instance.trigger( "keyup" );
  });

})( jQuery, this );
