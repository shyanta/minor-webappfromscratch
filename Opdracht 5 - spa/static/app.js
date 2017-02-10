(function(){
	var app = {
		init: function(){
			routes.init();
			var sections = document.querySelectorAll('section:not(#navigatie)');

			sections.forEach(function(sections){
				sections.hidden = true;
			});
		}
	};
	var routes = {
		init: function(){
			window.addEventListener('hashchange', function(){
				var hash = location.hash;
				sections.toggle(hash);
			});
		}
	};
	var sections = {
		toggle: function(route){
			var hash = location.hash;
			var sectionCurrent = document.querySelector('' + hash + '');
			var sections = document.querySelectorAll('section:not(#navigatie):not('+hash+')');
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