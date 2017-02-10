(function(){
	"use strict";
	var app = {
		init: function(){
			routes.init();
			var sections = document.querySelectorAll('section:not(#navigatie):not(#home)');
			sections.forEach(function(sections){
				sections.hidden = true;
			});
		}
	};
	var routes = {
		init: function(){
			window.onhashchange = function(){
				sections.toggle();
			};
		}
	};
	var sections = {
		toggle: function(){
			var hash = window.location.hash;
			var sectionCurrent = document.querySelector('' + hash + '');
			var sections = document.querySelectorAll('section:not(#navigatie):not('+hash+')');
			sections.forEach(function(sections){
				sections.hidden = true;
				sectionCurrent.hidden = false;
			});
		}
	};
	app.init();
}());