
(function ( $, window) {
	
	var pluginName = 'checkview';
	
	var defaults = {
	  'buttonTag': 'span', 
		'buttonClass': 'btn btn-default btn-xs btn-mini btn-checkview', 
		'iconClass': 'glyphicon glyphicon-ok icon-ok',
		'submitOnKeyEnter': true
	};

	var pluginClass = function CheckView(element, options) {
				
		var eventType = 'click';

		var checkView = this;
		
		var doc = element.ownerDocument;
		
		var $element = $(element);
		element.tabIndex = "-1";
		
		element.style.position = 'absolute';
		element.style.width = '0';
		element.style.height = '0'; 
		
		var nextElement = $(element).next();
		var previousElement = $(element).prev();
		var valueElement = nextElement && nextElement.tagName == "input" && nextElement.type == "hidden" ? nextElement
			 : previousElement && previousElement.tagName == "input" && previousElement.type == "hidden" ? previousElement
			 : null;
		
		var containerView, $containerView;
		
		var containerView = $element.parents("." + options.buttonClass)[0];
		if (!containerView) {
			containerView = doc.createElement(options.buttonTag || 'span');
			element.parentNode.insertBefore(containerView, element);
		}
    var $containerView = $(containerView);
		
		containerView.tabIndex = "0";
		containerView.className = options.buttonClass;
		containerView.style.display = 'inline-block';
		containerView.style.cursor = "pointer";
		
		var checkmarkIcon = doc.createElement('i');
		checkmarkIcon.className = options.iconClass;
		containerView.appendChild(checkmarkIcon);
		

		// private methods
		
		function init() {
			
			if (!element.value) {
				element.value = "on";
			}

			element.style.visibility = "hidden";
			containerView.appendChild(element);
			checkmarkIcon.style.verticalAlign = "top";

			var $label;
			
			$containerView.bind('keypress', function(event) {
				
				if (event.which == 32) {
					element.checked = !element.checked;
					checkView.invalidate();
				}
				
				if (event.which == 13 && options.submitOnKeyEnter) {
					if (element.form) {
						element.form.submit();
					}
				}
				
			});
		    
			$element.bind('change', function(event) {
				checkView.invalidate();
				window.clearTimeout(toggleClickTimeoutId);
			});
      
	    var toggleClickTimeoutId = null;
	    function toggleClick() {
	    	element.checked = !element.checked;
        $(element).trigger('change');
	    } 

			$(window).bind('resize', function() {
				checkView.invalidate();
			});
			
			this.invalidate();
			
		};
		
		function layout() {
		  var $containerView = $(containerView);
			if (element.checked) {
				$containerView.addClass('checked');
			} else {
				$containerView.removeClass('checked');
			}
			var $copyStyles = $(['margin-left']);
			var css = {};
			$copyStyles.each(function() {
			  var value = $element.css(this);
			  if (value) css[this] = value;
			});
			$containerView.css(css);
			
			checkmarkIcon.style.visibility = element.checked ? '' : 'hidden';
			checkmarkIcon.style.position = 'relative';
			checkmarkIcon.style.left = (($(containerView).width() - $(checkmarkIcon).width()) / 2) + 'px';
			checkmarkIcon.style.top = (($(containerView).height() - $(checkmarkIcon).height()) / 2) + 'px';
		};
		
		// public methods
		
		this.setChecked = function(bool) {
			element.checked = bool;
			if (bool) {
			  $element.attr('checked', 'checked');
			} else {
			  $element.removeAttr('checked');
			}
			this.invalidate();
		};
		
		this.isChecked = function() {
			return $(element).is(":checked");
		};
		
		this.invalidate = function() {
			layout.call(this);
		};

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

})( jQuery, window );