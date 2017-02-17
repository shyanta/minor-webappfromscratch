(function(){
	"use strict";

	var dataSearch;
	var dataSearchClean;
	var currentGifID;

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
			    'results/:id': function(){
			    	sections.detail();
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
			var info = document.querySelector("#info");
			var API_KEY = "dc6zaTOxFJmzC";
			var input = document.querySelector('input[name="gif-search"]').value;
			var searchKey = input.split(' ').join('+');
			info.hidden = true;

			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/search?q='+ searchKey + '&api_key=' + API_KEY + '&limit=50')
				.on('200', function(search){
					dataSearch = search.data;
			    	var searchList = document.querySelector('ul#search');
			    	dataSearchClean = dataSearch.map(function(prop){
			    		return {
				    		id : prop.id,
		                    source : prop.images.original.url,
		                    username : prop.username
	                   	};
			    	});
			    	console.log(dataSearchClean);
			    
			    	var directiveSearch = {
		    			gif_detail: {
			    			href: function (params){	
		    					return '#results/' + this.id;	    					
		    				}
		    			},
		    			gif_link: {
		    				src: function (params){
		    					return this.source;
		    				}
		    			}
			    	};

			    	Transparency.render(searchList, dataSearchClean, directiveSearch);
				})
				.go();
		},
		detail: function(id){
			var searchList = document.querySelector('ul#search');
			var info = document.querySelector("#info");
			searchList.hidden = true;
			info.hidden = false;

			var href = window.location.href;
			var hrefArray = href.split('/');
			var currentGifID = hrefArray[hrefArray.length - 1];

			var current = dataSearchClean.filter(function(dataID){
				return dataID.id === currentGifID;
			});

			var directiveSearch = {
    			gif_current: {
    				src: function (params){
    					return this.source;
    				}
    			},
    			user: {
	    			username: function (params){
	    				if ((this.username).length <= 1 ){
							return this.username + "Unknown";
						}
						else {
							return this.username;
						}
					}
				}
	    	};

	    	Transparency.render(info, current, directiveSearch);
		}
			
	};
	app.init();
}());
