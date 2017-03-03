(function () {
	"use-strict";

	var currentGifID;
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
		    'error': function(){
		    	sections.toggle();
		    },
		    'noresults': function(){
		    	sections.toggle();
		    },
		    'results/:id': function(){
		    	sections.detail();
		    }
		});
	};
	// var errorHandler = function(){
	// 	var body = document.querySelector('body');
	// 	body.innerHTML = '<h1>OEPS</h1>';
	// };

	var sections = {
		toggle: function(){
			var hash = location.hash || window.location.hash;
			var currentHash = document.querySelector(hash);
			var sectionArr = document.querySelectorAll('section:not('+hash+')');
			sectionArr.forEach(function(sectionArr){
				sectionArr.hidden = true;
				currentHash.hidden = false;
			});
		},
		toggleResults: function(type){
			var searchList = document.getElementById('search-results');
			var info = document.getElementById("info");
			if (type === "results"){				
				searchList.hidden = false;			
				searchList.classList.remove('hidden');
				info.hidden = true;
				info.classList.add('hidden');
			} else if (type === "detail"){
				searchList.hidden = true;			
				searchList.classList.add('hidden');
				info.hidden = false;
				info.classList.remove('hidden');
			}
		},
		search: function(){
			var form = document.getElementById('submit');
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
			var input = document.querySelector('input[name="gif-search"]').value;
			var searchKey = input.replace(' ','+');
			localStorage.setItem("searchKey",JSON.stringify(searchKey));
			sections.toggleResults('results');
			data.getResults(searchKey);
		},
		detail: function(id){
			sections.toggleResults('detail');
			
			var href = window.location.href; //Kan ook anders
			var hrefArray = href.split('/');
				currentGifID = hrefArray[hrefArray.length - 1];

			current = JSON.parse(localStorage.getItem('dataSearch')).filter(function(dataID){
				return dataID.id === currentGifID;
			});
			render.detail();
		},
		error: function(type){
			if (type === "api"){
				window.location.hash = "#error";
			} else if(type === "search"){
				window.location.hash = "#noresults";
			}
		}
			
	};

	var data = {
		getTrending: function(){
			aja()
				.method('get')
				.url('https://api.giphy.com/v1/gifs/trending?api_key=' + app.API_KEY)
				.on('200', function(trending){
					var dataTrending = trending.data.map(function(prop){
						return {
							id : prop.id,
							source : prop.images.original.url,
							href : prop.source
						};
					});
					localStorage.setItem("dataTrending",JSON.stringify(dataTrending));
			    	render.trending(JSON.parse(localStorage.getItem('dataTrending')));
				})
				.on('40x', function(){
					sections.error("api");
				})
				.go();
		},
		getResults: function(query){
			aja()
				.method('get')
				.url('https://api.giphy.com/v1/gifs/search?q='+ query + '&api_key=' + app.API_KEY + '&limit=50')
				.on('200', function(search){
					var dataSearch = search.data.map(function(prop){
					    return {
						    id : prop.id,
				            source : prop.images.original.url,
		                    username : prop.username
		               	};
			    	});
					localStorage.setItem("dataSearch",JSON.stringify(dataSearch));

					if(JSON.parse(localStorage.getItem("dataSearch")).length > 1 ){
						render.results(JSON.parse(localStorage.getItem('dataSearch')));
					}
					else{
						sections.error("search");
					}
				})
				.on('40x', function(){
					sections.error("api");
				})
				.go();
		}
	};

	var render = {
		trending : function(data){
			var trendingList = document.querySelector('#trending ul');			    
	    	var directives = {
    			gif_source: {
	    			href: function (){
    					return this.source;
    				}
    			},
    			gif_url: {
    				src: function (){
    					return this.source;
    				}
    			}
	    	};

	    	Transparency.render(trendingList, data, directives);
		},
		results : function(data){
			var searchList = document.getElementById('#search');
 
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

	    	Transparency.render(searchList, data, directiveSearch);
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
})();
