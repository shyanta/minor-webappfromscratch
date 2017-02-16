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
			    'info': function(){
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
			var search = 'cat';
			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/search?q='+ search + '&api_key=' + API_KEY)
				.on('200', function(search){
			    	var dataSearch = search.data;
			    	var searchList = document.querySelector('#search ul');
			    
			    	var directivesSearch = {
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
			    	console.log(dataSearch);

			    	Transparency.render(searchList, dataSearch, directivesSearch);
				})
				.go();
		}
	};
	app.init();
}());
