(function(){
	"use strict"
	var sections = document.querySelectorAll('section:not(#navigatie):not(#home)'); // Nu hoef je hem niet nog een keer te declareren.
	var app = {
		init: function(){
			routes.init();
// 			var sections = document.querySelectorAll('section:not(#navigatie):not(#home)');

			sections.forEach(function(sections){
				sections.hidden = true;
			});
		}
	};
	var routes = {
		init: function(){
// 			window.addEventListener('hashchange', function(){
// 				var hash = location.hash;
// 				sections.toggle(hash);
// 			});
			// Dit kan beter zo
			window.onhashchange = function() {
				sections.toggle(); 
			}
		}
	};
	var sections = {
		toggle: function(){ // Je gebruikt route nergens, dus die heb je ook niet nodig.
			var hash = window.location.hash; // Met window ervoor is netter
			var sectionCurrent = document.querySelector('' + hash + '');
// 			var sections = document.querySelectorAll('section:not(#navigatie):not('+hash+')');  <-- Staat bovenin al gedeclareerd
			
			// Console.log zou ik weghalen als je klaar bent met testen
			console.log(sections);
			console.log(sectionCurrent);

			sections.forEach(function(sections){
				sections.hidden = true;
				sectionCurrent.hidden = false;
			});
		}
	};

	app.init();
}());
