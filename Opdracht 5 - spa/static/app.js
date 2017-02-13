(function(){
	"use strict";

	var sectionArr = document.querySelectorAll('section:not(#navigatie):not(#home)');
		sectionArr.forEach(function(sections){
			sectionArr.hidden = true;
		});

	var app = {
		init: function(){
			routes.init();
		}
	};
	var routes = {
		init: function(){
			window.addEventlistener('hashchange', function(){
				sections.toggle();
			});
		}
	};
	var sections = {
		toggle: function(){
			var hash = window.location.hash;
			var current = document.querySelector('' + hash + '');
			var sectionArr = document.querySelectorAll('section:not(#navigatie):not('+hash+')');
			sectionArr.forEach(function(sections){
				sectionArr.hidden = true;
				current.hidden = false;
			});
		}
	};
	app.init();
}());