
(function ( $, window) {

	console.info ('init checkview plugin');
	
	var pluginName = 'checkView';
	
	var defaults = {
		'containerClass': 'checkview', 
		'iconClass': 'icon-ok',
		'autoSubmit': true
	};
	
	// TODO: replace with jquery has
	function isChildOf(child, parent) {
		if (parent == child) return false;
		var c = child;
		try {
			while (c) {
				if (child.ownerDocument != null && c == child.ownerDocument.documentElement) return false;
				if (c.parentNode == parent) return true;
				if (c.parentNode == null) return false; 
				c = c.parentNode;
			}
		} catch (e) {
			//console.error(e);
		}
		return false;
	}
	
	var pluginClass = function CheckView(element, options) {
		
		var eventType = 'click';

		var checkboxView = this;
		
		var doc = element.ownerDocument;
		
		var $elem = $(element);
		element.tabIndex = "-1";
		
		element.style.position = 'absolute';
		element.style.width = '0';
		element.style.height = '0'; 
		
		var nextElement = $(element).next();
		var previousElement = $(element).prev();
		var valueElement = nextElement && nextElement.tagName == "input" && nextElement.type == "hidden" ? nextElement
			 : previousElement && previousElement.tagName == "input" && previousElement.type == "hidden" ? previousElement
			 : null;
		
		var containerView = $(element).parents("." + options.containerClass)[0];
		if (!containerView) {
			containerView = doc.createElement('span');
			element.parentNode.insertBefore(containerView, element);
		}
		
		containerView.tabIndex = "0";
		containerView.className = options.containerClass;
		containerView.style.display = 'inline-block';
		containerView.style.lineHeight = "0";
		containerView.style.cursor = "pointer";
		
		var checkmarkIcon = doc.createElement('i');
		checkmarkIcon.style.margin = "0";
		checkmarkIcon.className = options.iconClass;
		containerView.appendChild(checkmarkIcon);

		// private methods
		
		function toggleCheckbox() {
			element.checked = !element.checked;
			checkboxView.invalidate();
		}
		
		function init() {
			
			if (!element.value) {
				element.value = "on";
			}

			element.style.visibility = "hidden";
			containerView.appendChild(element);
			checkmarkIcon.style.verticalAlign = "top";

			var $label;
			
			$(containerView).bind('keypress', function(event) {
				
				if (event.which == 32) {
					element.checked = !element.checked;
					checkboxView.invalidate();
				}
				
				if (event.which == 13 && options.autoSubmit) {
					if (element.form) {
						element.form.submit();
					}
				}
				
			});
			
			
			$(element).bind('change', function(event) {
				checkboxView.invalidate();
				window.clearTimeout(toggleClickTimeoutId);
			});
			
			$(containerView).parents('label').bind("click", function(event) {
				if (event.target != element && event.target != containerView && !isChildOf(event.target, containerView)) {
          			event.stopImmediatePropagation();
          			$(containerView).trigger('click');
        		}
      		});
      
		    var toggleClickTimeoutId = null;
		      
		    function toggleClick() {
		      	element.checked = !element.checked;
		        $(element).trigger('change');
		    }
		      
		    $(containerView).bind("click", function(event) {
		      	if (event.target != element) {
		        	window.clearTimeout(toggleClickTimeoutId);
		        	toggleClickTimeoutId = window.setTimeout(function() {
		            	toggleClick();
		          	}, 100);
		        	event.preventDefault();
		        };
		    });

			$(window).bind('resize', function() {
				checkboxView.invalidate();
			});
			
			this.invalidate();
			
		};
		
		function layout() {
			if (element.checked) {
				$(containerView).addClass('checked');
			} else {
				$(containerView).removeClass('checked');
			}
			checkmarkIcon.style.visibility = element.checked ? '' : 'hidden';
			checkmarkIcon.style.position = 'relative';
			checkmarkIcon.style.left = (($(containerView).width() - $(checkmarkIcon).width()) / 2) + 'px';
			checkmarkIcon.style.top = (($(containerView).height() - $(checkmarkIcon).height()) / 2) + 'px';
		};
		
		// public methods
		
		this.setChecked = function(bool) {
			element.checked = bool;
			if (bool) {
			  $(element).attr('checked', 'checked');
			} else {
			  $(element).removeAttr('checked');
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