var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

var color = atob((location.search.match(/color=([^&]+)/)||[])[1]||'');
if(color){ $('html, body').css('color', color) }
var size = atob((location.search.match(/size=([^&]+)/)||[])[1]||'');
if(size){ $('html, body').css('font-size', size) }
var width = (location.search.match(/width=([^&]+)/)||[])[1]||'';


var soul = (location.hash||'').slice(1);
$('div').html('<div style="overflow: hidden; white-space: nowrap;"><b>decrypting</b> <small>' + soul + '</small> ...</div>');
if(0 < (width = parseFloat(width))){ $('div').width(width) }
var t = $('a').offset().top;
both.runtime.sendMessage({rpc: 'toss', key: soul, decrypt: true, _:{I: 1}}, async function(ack){
	if(!ack || !ack.what){ return }
	$('div').html($.normalize(ack.what));
	setTimeout(function(){
		var h = $('a').offset().top;
		both.runtime.sendMessage({rpc: 'height', key: soul, height: h, _:{I: 1}});
	}, 1);
});
/*

var opt, user, gun;
;(async function(){ // login!
//localStorage.clear();sessionStorage.clear();
try{ opt = JSON.parse(localStorage['party-config']) }catch(e){}
opt = opt || {};
gun = Gun(opt.gun);
gun.on('auth', async function(ack){
	var foo = await gun.get(soul).then();
	$('div').text(JSON.stringify(foo));
});

if(opt.pair){
	user = gun.user().auth(opt.pair);
} else
if(opt.alias && opt.remember){
	user = gun.user().auth(opt.alias, opt.remember);
}
}());
*/