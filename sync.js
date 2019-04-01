;(function(){
// THIS FILE IS FOR LOCAL SYNC ONLY!
var sync = {};
$(document).on('change', function(eve){
	var where = location.hostname.split('.'), tmp;
	while(tmp = btoa(where.join('.'))){
		if(tmp = sync.where[tmp]){ tmp() }
		where = where.slice(1);
	}
});
$(document).on('party', function(eve, msg){
	var where = location.hostname.split('.'), tmp;
	while(tmp = btoa(where.join('.'))){
		if((tmp = sync.where[tmp]) && (tmp = tmp.pub)){ tmp(msg) }
		where = where.slice(1);
	}
});

sync.where = {};
;(function(){
sync.where['ZmFjZWJvb2suY29t'] = function(){try{
	$('._6qw4, ._4kk6, .profileLink, a').each(function(){
		var a = $(this).closest('a'), know = {}, tmp = a.text(), tmp2;
		if(!tmp){ return }
		if(tmp.match('://')){ return }
		know.name = tmp;
		tmp = alias(a);
		if(!tmp){ return }
		tmp = a.attr('href')||'';
		try{ tmp = new URL(tmp).pathname }catch(e){ tmp = tmp }
		if(!tmp){ return }
		tmp = tmp.split('?')[0];
		if(!tmp){ return }
		tmp = tmp.split('/');
		if(2 != tmp.length){ return }
		if('' != tmp[0]){ return }
		if(!tmp[1]){ return }
		tmp = know.alias = tmp[1];
		if(ras == tmp.slice(-4)){ return }
		if($(this).is('a') && 2 <= tmp.split(' ').length){ return }
		if(tmp2 = sync.already[tmp]){ if(tmp2.face){ return } know = tmp2 }
		sync.already[tmp] = know;
		tmp = a[0].outerHTML||'';
		if(tmp = (tmp.slice(tmp.indexOf('user'+ras+'?')).match(/id=([^\&\"\']+)/i)||[])[1]){
			know.fbid = tmp;
		}
		$.each(know, function(i,v){
			if(sync.skip[(v||'').toLowerCase()]){ return tmp = 1, false }
		});
		if(1 === tmp){ return }
		tmp = imagine(a);
		img2b64(tmp, function(b64){
			if(know.face){ return }
			if(b64){ know.face = b64 }
		  both.runtime.sendMessage({rpc: 'sync', put: know, _:{I: 1}}, function(ack){});
		});
	});
}catch(e){console.log(e)}}
sync.where['ZmFjZWJvb2suY29t'].pub = function(msg){try{
	if(!msg || !msg.$){ return }
	function find(el){ var id, obj = {}, tmp, text, a;
		if(el.is('body')){ return }
		el.find('a').each(function(){
			var html = this.outerHTML||'', tmp;
			if(!html){ return }
			obj.alias = alias(this);
			if(tmp = (html.slice(html.indexOf('user'+ras+'?')).match(/id=([^\&\"\']+)/i)||[])[1]){
				obj.id = id = tmp;
				obj.name = $(a = this).text() | $(this).find('[aria-label]').attr('aria-label');
				return false;
			}
			if(tmp = (html.slice(html.indexOf('profile'+ras+'?')).match(/id=([^\&\"\']+)/i)||[])[1]){
				obj.id = id = tmp;
				obj.name = $(a = this).text() || $(this).find('[aria-label]').attr('aria-label');
				return false;
			}
		});
		if(id){ return obj }
		return find(el.parent());
	}
	var id = find(msg.$);
	if(!id){ return }
	console.log('pub:', id);
	both.runtime.sendMessage({rpc: 'pub', know: id, put: msg.put, _:{I: 1}}, function(ack){});
}catch(e){console.log(e)}}
function alias(a, tmp){
	tmp = (a = $(a)).attr('href')||'';
	try{ tmp = new URL(tmp).pathname }catch(e){ tmp = tmp }
	if(!tmp){ return }
	tmp = tmp.split('?')[0];
	if(!tmp){ return }
	tmp = tmp.split('/');
	if(2 != tmp.length){ return }
	if('' != tmp[0]){ return }
	if(!tmp[1]){ return }
	return tmp = tmp[1];
}
}());
//$(function(){$('<div>').attr('id', 'IMGCHECK').css({'z-index': 999999, position: 'fixed', top: 0, left: 0, width: '10%', height: '100%'}).appendTo('body')});
sync.already = {};
sync.skip = {'settings':1, 'see all':1, 'notifications':1, 'events':1, 'recommendations':1, 'learn more':1, 'policies':1, 'terms':1,'about':1};
function imagine(a, tmp){
	if(a.is('body')){ return }
	if((tmp = a.find('img').first()).length){ return tmp[0] }
	return imagine(a.parent());
}
function img2b64(img, cb, w,h, f){
	if(!img){ return cb() }
	if(typeof img == 'string'){
		var i = new Image;
		i.crossOrigin = "Anonymous";
		i.onload = function(){ img2b64(i, cb) }
		i.src = img;
		return;
	}
	var c, ctx, r;
	try{ img.crossOrigin = "Anonymous";
	c = document.createElement('canvas');
	if(img.width < (w = w || 100) && img.height < (h||Infinity)){
		w = img.width;
		h = img.height;
	}
  if(!h){ h = img.height * (w / img.width) }
	c.width = w; c.height = h;
	ctx = c.getContext("2d");
	ctx.drawImage(img, 0, 0, w, h);
	r = c.toDataURL();
	}catch(e){ if(!f){ return img2b64(img.src, cb, w,h, 1) } }
	if('data:,' == r){ return cb() }
	return cb(r);
}
var ras = '.php';

}());