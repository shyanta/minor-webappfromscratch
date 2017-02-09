(function(){
	var app = {
		init: function(){
			routes.init();
		}
	};
	var routes = {
		init: function(){
			window.addEventListener('hashchange', sections.toggle());
		}
	};
	var sections = {
		toggle: function(route){
			alert("The anchor part has changed!");
		}
	};

	app.init();
}());