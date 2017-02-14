var API_KEY = "dc6zaTOxFJmzC";
var search = 'funny+cat';

aja()
	.method('get')
	.url('https://api.giphy.com/v1/gifs/search?q=' + search +'&api_key='+ API_KEY)
	.on('200', function(data){
    	console.log(data);
	})
	.go();