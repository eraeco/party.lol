var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

;(function check(){

  try{
  if(check.ing){ return }
  var now = both.runtime.getManifest(), n = parseFloat;
  $.getJSON("https://era.eco/party/package.json", function(data){
    if(!data){ return }
    var v = now.version.split('.'), w = data.version.split('.');
    if((n(v[0]) < n(w[0])) || (n(v[1]) < n(w[1])) || (n(v[2]) < n(w[2]))){
    	check.ing = window.open('./upgrade.html');
    }
  });
  }catch(e){ console.log(e) }

  setInterval(check, 1000 * 60 * 3); // 

}());