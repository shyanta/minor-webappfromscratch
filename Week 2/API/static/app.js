(function () {
	"use-strict";

	var searchItems;
	var currentGifId;
	// Check wat nodig is en maak er een config van

	var app = {
		init: function(){
			routes.routie();
		}
	};

	var routes = {
		routie : function(){
			//When refreshed always go to the #search
			routie('search');
			//Route defines what methods should be used at every hash
			routie({
			    'search': function() {
			    	toggle.pages();
					sections.search();
			    },
			    'results': function() {
			    	toggle.pages();
			    },
			    'error': function(){
			    	toggle.pages();
			    },
			    'noresults': function(){
			    	toggle.pages();
			    },
			    'results/:id': function(id){
			    	sections.detail(id);
			    }
			});
		}
	};

	var toggle = {
		pages: function(){
			//Make sure only the section with the current hash from the href is active
			//Hide the sections that don't have the same ID as the hash
			var hash = location.hash || window.location.hash;
			var currentHash = document.querySelector(hash);
			var sectionArr = document.querySelectorAll('section:not('+hash+')');
			sectionArr = Array.prototype.slice.call(sectionArr);
			sectionArr.forEach(function(section){
				section.hidden = true;
				currentHash.hidden = false;
			});
		},
		toResults: function(){
			//When switching from detailpage to results, toggle those parts
			//The hidden attribute is added because screenreaders will understand this, and will skip this part.
			//Display:flex messes up the hidden attribute functionality, so I also added a class with display:none
			var searchList = document.getElementById('search-results');
			var info = document.getElementById("info");
				searchList.hidden = false;
				searchList.removeAttribute('class','hidden');
				info.hidden = true;
				info.setAttribute('class','hidden');
		},
		toDetail: function(){
			//When switching from results to detailpage, toggle those parts
			//The hidden attribute is added because screenreaders will understand this, and will skip this part.
			//Display:flex messes up the hidden attribute functionality, so I also added a class with display:none
			var searchList = document.getElementById('search-results');
			var info = document.getElementById("info");
				searchList.hidden = true;
				searchList.setAttribute('class','hidden');
				info.hidden = false;
				info.removeAttribute('class','hidden');
		}
	}

	var sections = {
		loader : document.querySelector('.loader'),
		search: function(){
			var self = this;
			//Add eventlisteners to the inputfield and the submit button, to redirect to the #results page
			var form = document.getElementById('search-input');
			form.addEventListener('submit', function(){
				event.preventDefault();
				self.results();
			});
			//Fill the page with the Trending Data, for this data, go to the following function
			getData.trending();
		},
		results: function(){
			//Get value from the input field
			var input = document.querySelector('input[name="gif-search"]').value;
			//Replace every space with a plus, so the query from the api key works
			var searchKey = input.replace(' ','+');

			//Go to the toggleResults and make the results part active. Do this with the given parameter
			toggle.toResults();

			//Get the data from the searched key. Give the searchKey as an parameter, so the searchkey
			//only has to be declared once
			getData.results(searchKey);
		},
		detail: function(){
			//Got to the toggleResults and make the detail part active. Do this with the given parameter
			toggle.toDetail();
			console.log(currentGifId);
			//Filter data on the ID, this only returns the gif that is clicked, which gives a detail page
			var current = JSON.parse(localStorage.getItem('dataSearch')).filter(function(data){
				return data.id === currentGifId;
			});
			console.log(current);
			//Go to the render page to push the data to the HTML
			render.detail(current);
		},
		error: function(type){
			//If the error is created on the apicall, give the following error
			if (type === "api"){
				//Go to #error with routie to render the right section with the api error
				window.location.hash = "#error";
			//If the error is created on a search, give the following error
			} else if(type === "search"){
				//Go to #noresults with routie to render the section with the search error
				window.location.hash = "#noresults";
			}
		}

	};

	var getData = {
		//Add API key to use in the methods below
		API_KEY : "dc6zaTOxFJmzC",
		//Do an API call on the trending data
		trending: function(){
			sections.loader.classList.remove('hidden');
			aja()
				.method('get')
				.url('https://api.giphy.com/v1/gifs/trending?api_key=' + getData.API_KEY)
				.on('200', function(trending){
					//clean the received data and only return the needed properties
					var dataTrending = trending.data.map(function(prop){
						return {
							id : prop.id,
							source : prop.images.original.url,
							href : prop.source
						};
					});
					//Store data in localStorage
					localStorage.setItem("dataTrending",JSON.stringify(dataTrending));
					//Go to the render function, so the data will be pushed to the HTML
					//Give the data in a parameter, so the next function has the parsed data
			    	render.trending(JSON.parse(localStorage.getItem('dataTrending')));
			    	sections.loader.classList.add('hidden');
				})
				.on('40x', function(){
					//When the api gives an error go to the error section
					//Give the parameter API so the error section knows what errorsection to handle
			    	sections.loader.classList.add('hidden');
					sections.error("api");
				})
				.on('500', function(){
					//When the api gives an error go to the error section
					//Give the parameter API so the error section knows what errorsection to handle
			    	sections.loader.classList.add('hidden');
					sections.error("api");
				})
				.go();
		},
		results: function(query){
			sections.loader.classList.remove('hidden');
			aja()
				.method('get')
				.url('https://api.giphy.com/v1/gifs/search?q='+ query + '&api_key=' + getData.API_KEY + '&limit=30')
				.on('200', function(search){
					//clean the received data and only return the needed properties
					var dataSearch = search.data.map(function(prop){
					    return {
						    id : prop.id,
				            source : prop.images.original.url,
		                    username : prop.username
		               	};
			    	});
					//Store data in localStorage
					localStorage.setItem("dataSearch",JSON.stringify(dataSearch));

					//If the given data contains more than 1 object, push the data to the HTML
					if(JSON.parse(localStorage.getItem("dataSearch")).length >= 1 ){
						render.results(JSON.parse(localStorage.getItem('dataSearch')));
						window.location.hash = '#results';
						searchItems = document.querySelectorAll('.search-item');
						console.log(searchItems);
						searchItems.forEach(function(searchData){
							searchData.addEventListener('click', function(){
								currentGifId = this.id;
								console.log(this.id);
							})
						})
					}
					else{
						//If the given data contains less then 1 object, redirect to the searchError section
						sections.error("search");
						sections.loader.classList.add('hidden');
					}
				})
				.on('40x', function(){
					//When the api gives an error go to the error section
					//Give the parameter API so the error section knows what errorsection to handle
			    	sections.loader.classList.add('hidden');
					sections.error("api");
				})
				.on('500', function(){
					//When the api gives an error go to the error section
					//Give the parameter API so the error section knows what errorsection to handle
			    	sections.loader.classList.add('hidden');
					sections.error("api");
				})
				.go();
		}
	};

	var render = {
		trending : function(data){
			//Get the section which contains the right HTML template
			var trendingList = document.querySelector('#trending ul');
	    	var directives = {
    			gif_source: {
	    			href: function (){
	    				//Place the source propertie at the <a href=""> from the HTML template
    					return this.source;
    				}
    			},
    			gif_url: {
    				src: function (){
	    				//Place the source propertie at the <img src=""> from the HTML template
    					return this.source;
    				}
    			}
	    	};
	    	//Use transparency to render the data to the HTML template
	    	Transparency.render(trendingList, data, directives);
		},
		results : function(data){
			//Get the section which contains the right HTML template
			var searchList = document.querySelector('ul#results');

	    	var directiveSearch = {
				gif_id : {
					id: function(){
						return this.id;
					}
				},
    			gif_detail: {
	    			href: function (){
	    				//Add the ID property at the <a href="#results/"> from the HTML template
    					return '#results/' + this.id;
    				}
    			},
    			gif_link: {
    				src: function (){
	    				//Place the source propertie at the <img src=""> from the HTML template
    					return this.source;
    				}
    			}
	    	};
	    	//Use transparency to render the data to the HTML template
	    	Transparency.render(searchList, data, directiveSearch);
			sections.loader.classList.add('hidden');
		},
		detail : function(current){
			var backToResults = document.querySelector('a[href="#results"]');
			backToResults.addEventListener('click', function(){
				toggle.toResults();
			});
			var detailedGif = document.getElementById('detailed-gif');
			//Get the section which contains the right HTML template
			var directiveSearch = {
				gif_current: {
					src: function (){
						//Place the source propertie at the <img src=""> from the HTML template
						return this.source;
					}
				},
				username: {
					text: function (){
						if ((this.username) === "" ){
							//If the username property is empty, place Unknown in the <span> from the HTML template
							//so users know that there isn't a username
							return "Unknown";
						}
						else {
							//If the username property contains text, place this in the <span> from the HTML template
							return this.username;
						}
					}
				}
			};
			//Use transparency to render the data to the HTML template
			Transparency.render(detailedGif, current, directiveSearch);

			console.log('rendered');
		}
	};
	app.init();
})();
