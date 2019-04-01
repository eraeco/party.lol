var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

var story = {}

story.first = function(){
  var tmp = window.localStorage.welcome;
  if(tmp){ return }
  if(location.pathname.indexOf('options') < 0){
    try{ both.tabs.create({url: '/options.html'}); }catch(e){}
    return;
  }
  location.hash = 'welcome';
}

story.first();

$('#custom').on('click', function(){
	alert("Secret Agent Mode coming soon! Once enough of your friends have posted secret messages, it will automatically associate their 'public keys' so you can send them secure private messages. Keep PARTY installed to get access to these upcoming features!");
});