(function(){
	"use strict";

	var app = {
		init: function(){
			routes.init();
		}
	};
	var routes = {
		init: function(){	


			window.location.hash = "#search";
			sections.toggle();

			routie({
			    'search': function() {
			    	sections.toggle();
					sections.search();
			    },
			    'results': function() {
			    	sections.toggle();
			    	sections.results();
			    },
			    'results/:name': function(){
			    	sections.toggle();
			    }
			});
		}

	};
	var sections = {
		toggle: function(){
			var	hash = window.location.hash;
			var current = document.querySelector('' + hash + '');
			var sectionArr = document.querySelectorAll('section:not('+hash+')');
			sectionArr.forEach(function(sectionArr){
				sectionArr.hidden = true;
				current.hidden = false;
			});
		},
		search: function(){
			var form = document.querySelector('#submit');
			var input = document.querySelector('input[name="gif-search"]');
			form.addEventListener('click', goToResults);
			input.addEventListener('keypress', checkKeyCode, goToResults);

			function checkKeyCode(key){
				if (key.keyCode === 13) {
		            goToResults();
		        }
			}
			function goToResults(){
				window.location.hash = "#results";
			}

			var API_KEY = "dc6zaTOxFJmzC";
			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/trending?api_key=' + API_KEY)
				.on('200', function(trending){
					var data = trending.data;
			    	var trendingList = document.querySelector('#trending ul');
			    	console.log(data);
			    
			    	var directives = {
		    			gif_source: {
			    			href: function (params){
		    					return this.source;
		    				}
		    			},
		    			gif_url: {
		    				src: function (params){
		    					return this.images.original.url;
		    				}
		    			}
			    	};

			    	Transparency.render(trendingList, data, directives);
				})
				.go();
		},

		results: function(){
			var API_KEY = "dc6zaTOxFJmzC";
			var input = document.querySelector('input[name="gif-search"]').value;
			var searchKey = input.split(' ').join('+');
			console.log(searchKey);

			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/search?q='+ searchKey + '&api_key=' + API_KEY + '&limit=50')
				.on('200', function(search){
					var dataSearch = search.data;
			    	var searchList = document.querySelector('ul#search');
			    	console.log(dataSearch);
			    
			    	var directiveSearch = {
		    			gif_detail: {
			    			href: function (params){
		    					return this.source;
		    				}
		    			},
		    			gif_link: {
		    				src: function (params){
		    					return this.images.original.url;
		    				}
		    			}
			    	};

			    	Transparency.render(searchList, dataSearch, directiveSearch);
				})
				.go();
		}
	};
	app.init();
}());
