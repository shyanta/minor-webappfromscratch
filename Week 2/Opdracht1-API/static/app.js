(function(){
	"use strict";

	var dataTrending;
	var dataSearch;
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
			
			//Elton says: No need of the ''+. You are adding empty spaces with it.
			//var current = document.querySelector('' + hash + '');
			current = document.querySelector(hash);
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
			
			// Elton says: I see that you are storing the gotten data in the localstorage
			// later on, but you are overwritting the data every time with this function.
			// try checking if it already exist
			//data.getTrending();
			if(localStorage.getItem("dataTrending")){
				render.trending();
			}else {
				data.getTrending();
			}
		},

		results: function(){
			var info = document.querySelector("#info");
			var input = document.querySelector('input[name="gif-search"]').value;
			
			// Elton says: No need for global var you are not using more than once
			// also there is a function for doing .split(..).join(..)
			//var searchKey = input.split(' ').join('+');
			var searchKey = input.replace(' ','+');
			info.hidden = true;
			info.classList.add('hidden');
			
			// Elton says: Pas the searchKey (or other stuff) as a parameter so you can use it in other functions
			data.getResults(searchKey);
		},
		detail: function(id){
			var searchList = document.querySelector('ul#search');
			var info = document.querySelector("#info");
			searchList.hidden = true;			
			searchList.classList.add('hidden');
			info.hidden = false;
			info.classList.remove('hidden');

			var href = window.location.href; //Kan ook anders
			var hrefArray = href.split('/');
			// Elton says: don't declare a var more than once
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
		// Elton says: You have to catch the searchKey you passed on while calling the function
		getResults: function(query){
			aja()
				.method('get')
				// Elton says: use the parameter instead of the global object
				.url('http://api.giphy.com/v1/gifs/search?q='+ query + '&api_key=' + app.API_KEY + '&limit=50')
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
