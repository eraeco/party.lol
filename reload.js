var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

;(function(){

	console.log('reloaded');

}());