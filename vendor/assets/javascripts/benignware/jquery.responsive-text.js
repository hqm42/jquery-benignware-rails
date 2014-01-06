
// Ensure private scope + aliases
(function ( $, window) {
	
	
	/**
	 * jQuery-Plugin for viewport based font-sizing
	 * 
	 * viewport-based font-scaling
	 * 
	 */ 
	
	var pluginName = 'responsiveText';
	
	var defaults = {
		'fontSize': '', 
		'minFontSize': '12px', 
		'maxFontSize': '', 
		'bindResize': true
	};
	
	var pluginClass = function ResponsiveText(element, options) {
		
		var responsiveText = this;
		
		
		// private methods
		
		/* returns font-size in pixels */
		function parseFontSize(string) {
			if (!string) {
				return 0;
			}
			var fontSize = 0;
			
			var matches = string.match(/^(\d+(?:\.\d+)?)(.*)$/);
			
			var value = matches ? matches[1] : "";
			var unit = matches ? matches[2] : "";
			
			switch (unit) {
				
				case 'vw': 
					fontSize = $(window).innerWidth() / 100 * value;
					break;
					
				case 'vh': 
					fontSize = $(window).innerHeight() / 100 * value;
					break;
				
				default: 
					$(element).css('fontSize', value + unit); 
					fontSize = parseFloat($(element).css('fontSize'));
			}
			
			return !isNaN(fontSize) ? fontSize : 0;
		}
		
		function init() {
			
			if (options.bindResize) {
				$(window).bind('resize', function() {
					responsiveText.invalidate();	
				});
			}
			
			this.invalidate();
		}
		
		// public methods
		
		this.invalidate = function() {
			var fontSize = parseFontSize(options.fontSize);
			var minFontSize = parseFontSize(options.minFontSize);
			var maxFontSize = parseFontSize(options.maxFontSize);
			fontSize = minFontSize ? Math.max(fontSize, minFontSize) : fontSize;
			fontSize = maxFontSize ? Math.min(fontSize, maxFontSize) : fontSize;
			$(element).css('fontSize', fontSize + "px");
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