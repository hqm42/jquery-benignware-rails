
+function ( $, window) {
  
  window.console = window.console || {
    log: function() {}, 
    info: function() {}
  };
  
  var pluginName = 'nativepicker';
  
  var defaults = {
    // options
    type: 'auto', 
    toggleEvent: 'touchstart mousedown', 
    // callback
    show: null, 
    change: null
  };
  
  // http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime());
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;   
  }
  
  // http://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
  function getLocalIsoString(date) {
    date = convertUTCDateToLocalDate(date);
    var padDigits = function padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    };

    var tzOffset = date.getTimezoneOffset() + 30 * -1,
        tzHour = padDigits( Math.floor(tzOffset / 60), 2 ),
        tzMin = padDigits( (tzOffset % 60), 2 ),
        tz = "";

    tz = tzHour > 0 ? "+" : "-";
    tz = tz + tzHour + ":" + tzMin;

    return date.getFullYear() 
            + "-" + padDigits((date.getMonth()+1),2) 
            + "-" + padDigits(date.getDate(),2) 
            + "T" 
            + padDigits(date.getHours(),2)
            + ":" + padDigits(date.getMinutes(),2)
            + ":" + padDigits(date.getSeconds(),2)
            + "." + padDigits(date.getMilliseconds(),2)
            + tz;
  }
  
  // TODO: cache results
  function isTypeSupported(type) {
    
    switch (type) {
      
      // html4 input types
      case 'select': 
      case 'text':
      case 'textarea':
        result = true;
        break;
      default: 
        // detect html5 input types
        var i = document.createElement('input');
        i.setAttribute("type", type);
        // general support
        if (i.getAttribute('type') == type) {
          // exact support
          switch (type) {
            case 'date': 
              var testValue = "not a timestring";
              i.setAttribute('value', testValue);
              // html5 date control accepts iso time strings only
              if (!i.value) {
                result = true;
                break;
              }
            default: 
              result = false;
          }
        }
        delete i;
    }
    
    
    return result;
  }
  
  var pluginClass = function NativePicker(element, options) {
    
    var nativePicker = this;
    var inputSelector = options.inputSelector;
    var $element = $(element);
    var picker, toggle;
    
    // TODO: define exact relations and provide as option
    var inputSelector = "select, input[type='text]', input[type='date'], textarea"; 
    
    
    function getType() {
      if (options.type && options.type != 'auto') {
        return options.type;
      }
      var picker = getPicker();
      
      if (picker) {
        var tagName = picker.prop('tagName').toLowerCase();
        switch (tagName) {
          case 'select': 
          case 'textarea': 
            return tagName;
          case 'input': 
            return picker.prop('type');
        }
      }
      return null;
    }
    
    function getPicker() {
      
      if (!picker) {
        picker = $element.is(options.inputSelector) ? $element : (function() {
          // create the picker
          var picker = null;
          var type = getType();
          switch (type) {
            case 'select': 
              picker = document.createElement(type);
              break;
            default: 
              picker = document.createElement('input');
              picker.setAttribute('type', type);
              picker.setAttribute('min', options.min);
          }
          $(picker).on('change', function(event) {
            pickerChanged();
          });
         
          element.parentNode.insertBefore(picker, element); 
          return $(picker);
        })();
      }
      return picker;
    }
    
    function getToggle() {
      toggle = options.toggle ? 
        typeof (options.toggle) == "function" ? options.toggle.call(element) : $(options.toggle)
        : $element;
      return toggle;
    }
    
    var toggle = getToggle(); 
    
    function layout() {
      var picker = getPicker();
      var toggle = getToggle();
      if (picker && toggle) {
        picker.css({
          opacity: 0, 
          position: 'absolute', 
          zIndex: -1, 
          width: toggle.outerWidth(false), 
          height: toggle.outerHeight(false), 
          display: ''
        });
      }
    }
    
    function toggleHandler(event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      showPicker();
    }
    
    function showPicker() {
      input = getPicker();
      if (options.show) {
        options.show.call(element);
      }
      input.focus();
    }
    
    this.getPickerValue = function() {
      value = getPicker().prop('value');
      if (!value) {
        // default values
        if (options.min) {
          value = options.min;
        } else {
          value = "";
        }
      }
      return value;
    };
    
    this.setPickerValue = function(value) {
      if (value instanceof Date) {
        value = getLocalIsoString(value).substring(0, 10);
      }
      getPicker().prop('value', value);
    };
    
    function pickerChanged() {
      var value = nativePicker.getPickerValue();

      // update toggle content      
      switch (toggle.prop('tagName').toLowerCase()) {
        case 'input': 
        case 'select': 
          toggle.prop('value', value);
          break;
        default: 
          toggle.html(value);
      }
      if (options.change) {
        value = options.change.call(element, value);
      }
    }
    
    // TODO: as option
    function isSupported() {
      return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) );
    }
    
    function init() {
      
      if (!isSupported()) {
        // native picker not supported or required in general 
        return;
      }
      
      var type = getType();
      if (type && !isTypeSupported(type)) {
        // input type is not natively supported
        return;
      }
      
      // bind
      getToggle().bind(options.toggleEvent, toggleHandler);
      
      // initial layout      
      layout.call(this);
    }
    
    init.call(this);
    
  };
  

  // bootstrap plugin
  $.fn[pluginName] = function(options) {
    options = $.extend({}, defaults, options);
    return this.each(function() {
      if (!$(this).data(pluginName)) {
        $(this).data(pluginName, new pluginClass(this, options));
      }
      return $(this);
    });
  };

}( jQuery, window );