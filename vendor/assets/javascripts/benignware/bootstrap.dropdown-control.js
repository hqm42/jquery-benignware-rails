
// Ensure private scope + aliases
+function ( $, window) {

  var pluginName = "dropdownControl";
  
  var _super = $.fn.dropdown;
  
  // TODO: defaults have no effect
  $.extend(_super.Constructor.DEFAULTS, { 
    showOnFocus: false, 
    focusInput: false
  });
  
  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle=actions]';
  
  var inputSelector = "input[type!='hidden']";
  
  // bootstrap original helper methods
  function getParent($this) {
    var selector = $this.attr('data-target');
    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
    }
    var $parent = selector && $(selector);
    return $parent && $parent.length ? $parent : $this.parent();
  }

  function getBackdrop($element) {
    var parent = getParent($element);
    return parent.find('.dropdown-backdrop');
  }

  function clearMenu(toggle) {
    $(backdrop).remove();
    
    $(toggle).each(function (e) {
      
      var $parent = getParent($(this));
      if (!$parent.hasClass('open')) return
      
      $parent.trigger(e = $.Event('hide.bs.dropdown'));
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown');
      // blur inputs
      $parent.find(".dropdown-menu " + inputSelector).blur();
    });
  }
  
  
  // custom helper methods
  function getMenu($element) {
    return $element.next('.dropdown-menu');
  }
  
  function isOpen($element) {
    return getParent($element).hasClass('open');
  }
  
  function focusInput(menu) {
    menu.find(inputSelector).first().focus();
  }
  
  // create a new constructor
  function DropdownControl(element, options) {
  
       // call the original constructor
      //_super.Constructor.apply( this, arguments );
      
      // do custom constructor stuff here
      var $element = $(element);
      
      var toggle = element;
      var parent = getParent($element);
      var menu = getMenu($element);
        
      // init key events
      $element.on('keydown.bs.dropdown.data-api', DropdownControl.prototype.keydown);
      
      // show on focus
      $element.on('focus', function(event) {
        if (!clickContext && options.showOnFocus && !isOpen($element)) {
          event.preventDefault();
          DropdownControl.prototype.toggle.apply(this, arguments);
          if (options.focusInput) {
            focusInput(menu); 
          }
        }
      });
      
      // start click context on toggle element
      $element.on('mousedown touchstart', function(event) {
        if (!clickContext) {
          clickContext = true;
        }
      });
      
      // start click context on parent element
      parent.on('mousedown touchstart', function(event) {
        if (!clickContext) {
          clickContext = true;
        }
      });
      
      $element.on('click', function(event) {
        if (isOpen($element)) {
          if (!('ontouchstart' in window)) {
            clearMenu($element);
          }
        } else {
          DropdownControl.prototype.toggle.apply(this, arguments);
          if (options.focusInput) {
            focusInput(menu); 
          }
        }
        
        event.stopImmediatePropagation();
        event.preventDefault();
        clickContext = false;
      });
      
      // end click context on parent click
      parent.on('click', function(event) {
        clickContext = false;
        event.stopImmediatePropagation();
      });

      
      var clickContext = false;
      
      
      // clear menu on blur
      menu.find(inputSelector).on('blur', function(event) {
        if (!clickContext) {
          window.setTimeout(function() {
            if (isOpen($element)) {
              
              if (!menu.has(document.activeElement).length) {
                clearMenu(element);
              }
            }
            
          }, 0);
        }
      });
      
      
      // close on click outside
      $(document)
        .on('mousedown touchstart', function(event) {
          var parent = getParent($element);
          if (isOpen($element) && 
            (!parent.is(event.target) && !parent.has(event.target).length)) {
            clearMenu($element);
          }
        })
        .on('click.bs.dropdown.data-api', function(event) {
        });
      
     
      
  };

  
  // extend prototypes and add a super function
  DropdownControl.prototype = $.extend({}, _super.Constructor.prototype, {
      Constructor: DropdownControl,
      toggle: function(e) {
        if (!isOpen($(this))) {
          _super.Constructor.prototype.toggle.apply(this, e);    
          // remove backdrop      
          var backdrop = getBackdrop($(this));
          backdrop.remove();
        } else {
          // do nothing
        }
      }, 
      keyDown: function(e) {
        _super.Constructor.prototype.keyDown.apply(this, e);
      }
  });
  
  
  // plugin initialization
  var pluginClass = DropdownControl;
  $.fn[pluginName] = $.extend(function(option) {

    var args = $.makeArray(arguments),
        option = args.shift();

    return this.each(function() {

        var $this = $(this);
        var data = $this.data(pluginName),
            options = $.extend({}, _super.defaults, $this.data(), typeof option == 'object' && option);

        if ( !data ) {
            $this.data(pluginName, (data = new pluginClass(this, options)));
        }
        if (typeof option == 'string') {
            data[option].apply( data, args );
        }
        
    });

  }, $.fn[pluginName]);
  
}( jQuery, window );