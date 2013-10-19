
// Ensure private scope + aliases
(function ( $, window) {
	
	function getDocHeight(){
	     var doc = document;
	     return Math.max(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight), Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight), Math.max(doc.body.clientHeight, doc.documentElement.clientHeight));
	};
	
	
	/**
	 * jQuery-Plugin: BackToTop
	 * 
	 * simple "scroll to top"-link
	 * 
	 */ 
	
	var pluginName = 'backToTop';
	
	var defaults = {
		duration: 500, 
		easing: 'swing', 
		autoHide: true
	};
	
	var pluginClass = function BackToTop(element, options) {
		
		var scrollToTop = this;
		
		var $element = $(element);
		var $window = $(window);
		
		function resize() {
				
			if (options.autoHide) {
				$element.css('display', '');
				var dh = getDocHeight();
				var vh = $window.height();
				if (vh >= dh) {
					$element.css('display', 'none');
				}
				
			}
		}
		
		function init() {
			$element.css('cursor', 'pointer');
			$element.bind('click', function() {
				$('html,body').animate({
					scrollTop: 0
				}, {
					duration: options.duration, 
					easing: options.easing
				});
			});
			
			$window.bind('resize', resize);
		}

		resize();
		
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