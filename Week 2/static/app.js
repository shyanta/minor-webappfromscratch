aja()
	.method('get')
	.url('http://www.recipepuppy.com/api/')
	.on('200', function(data){
    	console.log(data);
	})
	.go();