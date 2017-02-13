aja()
	.method('get')
	.url('https://api.spotify.com')
	.on('200', function(data){
    	console.log(data);
	})
	.go();