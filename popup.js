var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

var pop = {};
pop.yes = function(){
	both.runtime.sendMessage({rpc: 'say', _: {I: 1, say: true, yes: true}});
}
pop.no = function(){
	both.runtime.sendMessage({rpc: 'say', _: {I: 1, no: false}});
}
pop.encrypt = async function(){
	both.runtime.sendMessage({rpc: 'say', _: {I: 1, say: $('#say').html()}});
}
pop.ask = function(q){
	q = q || window.ASK;
	var ask = $('.ask');
	if(!q || !ask){ return }
	ask.text(q);
	if('any' === location.hash.slice(1)){
		setTimeout(function(){
			if(!$('#say').is(':focus')){
				$('#say').focus();
			}
		},10);
	}
}
window.onfocus = function(){ pop.ask() }
document.addEventListener('DOMContentLoaded', function() {
	pop.ask();
  $('#link').on('click', function() {
      chrome.tabs.create({url: '/index.html'});
  });

  $('#yes').on('click', pop.yes);
  $('#no').on('click', pop.no);
  $('#encrypt').on('click', pop.encrypt);
  $('#broadcast').on('click', function(){
    alert("Broadcast Mode coming soon! It'll help you, bands, artists, startups, etc. promote your work automatically across all social media websites in one click. Broadcasting is when you want publicity, not privacy. Keep PARTY installed to get access to these upcoming features!");
  });
  $(document).on('keypress', function(eve){
    if(13 === eve.which){
      var hash = location.hash.slice(1);
      if('ask' === hash){
        pop.yes();
      }
      if('any' === hash){
        if(eve.metaKey){
          pop.encrypt();
        }
      }
      return;
    }
  }).on('keydown', function(eve){
    if(27 === eve.which){
      window.close();
      return;
    }
  })
});
