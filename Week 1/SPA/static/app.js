(function(){
	"use strict";

	var app = {
		init: function(){
			routes.init();
		}
	};
	var routes = {
		init: function(){			
			window.location.hash = "#home";
			sections.toggle();
			window.addEventListener('hashchange', function(){
				var hash = window.location.hash;
				sections.toggle(hash);
			});
		}
	};
	var sections = {
		toggle: function(){
			var hash = window.location.hash;
			var current = document.querySelector('' + hash + '');
			var sectionArr = document.querySelectorAll('section:not(#navigatie):not('+hash+')');
			sectionArr.forEach(function(sectionArr){
				sectionArr.hidden = true;
				current.hidden = false;
			});
		}
	};
	app.init();
}());