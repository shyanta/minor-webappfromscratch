(function(){
	"use strict";

	var dataTrending;
	var dataSearch;
	var currentGifID;
	var searchKey;
	var current;
	// Check wat nodig is en maak er een config van

	var app = {
		API_KEY : "dc6zaTOxFJmzC",
		init: function(){
			routes();
		}
	};
	var routes = function(){		
		routie('search');
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
	};

	var sections = {
		toggle: function(){
			var hash = window.location.hash;
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

			data.getTrending();
		},

		results: function(){
			var info = document.querySelector("#info");
			var input = document.querySelector('input[name="gif-search"]').value;
			searchKey = input.split(' ').join('+');
			info.hidden = true;
			data.getResults();
		},
		detail: function(id){
			var searchList = document.querySelector('ul#search');
			var info = document.querySelector("#info");
			searchList.hidden = true;
			info.hidden = false;

			var href = window.location.href; //Kan ook anders
			var hrefArray = href.split('/');
			var currentGifID = hrefArray[hrefArray.length - 1];

			current = dataSearch.filter(function(dataID){
				return dataID.id === currentGifID;
			});
			render.detail();
		}
			
	};

	var data = {
		getTrending: function(){
			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/trending?api_key=' + app.API_KEY)
				.on('200', function(trending){
					dataTrending = trending.data;
					localStorage.setItem("dataTrending",JSON.stringify(dataTrending));
			    	render.trending();
				})
				.go();
		},
		getResults: function(){
			aja()
				.method('get')
				.url('http://api.giphy.com/v1/gifs/search?q='+ searchKey + '&api_key=' + app.API_KEY + '&limit=50')
				.on('200', function(search){
					dataSearch = search.data.map(function(prop){
					    return {
						    id : prop.id,
				            source : prop.images.original.url,
		                    username : prop.username
		               	};
			    	});
					localStorage.setItem("dataSearch",JSON.stringify(dataSearch));
			    	render.results();
				})
				.go();
		}
	};

	var render = {
		trending : function(){
			var trendingList = document.querySelector('#trending ul');			    
	    	var directives = {
    			gif_source: {
	    			href: function (){
    					return this.source;
    				}
    			},
    			gif_url: {
    				src: function (){
    					return this.images.original.url;
    				}
    			}
	    	};

	    	Transparency.render(trendingList, JSON.parse(localStorage.getItem('dataTrending')), directives);
		},
		results : function(){
			var searchList = document.querySelector('ul#search');
			    
	    	var directiveSearch = {
    			gif_detail: {
	    			href: function (){	
    					return '#results/' + this.id;	    					
    				}
    			},
    			gif_link: {
    				src: function (){
    					return this.source;
    				}
    			}
	    	};
	    	Transparency.render(searchList, JSON.parse(localStorage.getItem('dataSearch')), directiveSearch);
		},
		detail : function(){
			var directiveSearch = {
    			gif_current: {
    				src: function (){
    					return this.source;
    				}
    			},
    			username: {
	    			text: function (){
	    				if ((this.username).length <= 1 ){
							return "Unknown";
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