var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

;(function(){
if(location.host.match(/google|youtube|facebook|gmail|reddit|twitter|linkedin/ig)){ return } // disable SEA to respect tech giant's policies.

window.addEventListener("message", function(eve){
	if(!eve || eve.source != window){ return }
	eve = eve.data;
	var id, tmp;
	if(!eve || eve['@'] || !(id = eve['#'])){ return }
  eve._ = {};
  both.runtime.sendMessage(eve, function(ack){
  	if(!ack){ return }
  	ack['@'] = id;
  	window.postMessage(ack, "*");
  });
}, false);

function inject(code){try{
  var h = document.head || document.documentElement;
  var s = document.createElement('script');
  s.setAttribute('async', false);
  s.textContent = (typeof code == 'string')? code : ';('+code+'());';
  h.insertBefore(s, h.children[0]);
  h.removeChild(s);
  return code;
}catch(err){console.log('Identifi failed to add polyfill/shim to page.', err)}}

inject(function(){try{
  window.SEA = {};
  var ask = {};
  window.addEventListener("message", function(eve){
    if(!eve || eve.source != window){ return }
    eve = eve.data;
  	var tmp, id;
    if(!eve || !(id = eve['@']) || !(tmp = ask[id])){ return }
    tmp(eve);
    delete ask[id];
  }, false);
  var n1 = ['PROOF OF WORK', 'ENCRYPTION', 'DECRYPTION', 'SIGNING', 'SIGNATURE VERIFICATION', 'SECRET SHARING'];
  ['work', 'encrypt', 'decrypt', 'sign', 'verify', 'secret'].forEach(function(method, i){
    SEA[method] = function(data, pair, cb, opt){
      console.log("IDENTIFI HAS HIJACKED SEA's "+n1[i]+" FOR SECURITY REASONS!");
      return new Promise(function(res, rej){
        cb = cb || function(){};
        pair = (pair instanceof Function)? undefined : pair;
        var put = {data: data, pair: pair, opt: opt}, id = ''+Math.random();
        ask[id] = function(ack){
          if(!ack){ return }
          if(ack.err){
            console.log(ack.err);
            SEA.err = ack.err;
            cb(); res(); // rej() is handled by SEA, not the plugin.
            return;
          }
          cb(ack.put); res(ack.put);
        }
        window.postMessage({rpc:['SEA',method], put: put, '#': id}, "*");
      });
    }
  });
  var n2 = ['NAMING', 'KEY GENERATION'];
  ['name', 'pair'].forEach(function(method, i){
    SEA[method] = function(cb, opt){
      console.log("IDENTIFI HAS HIJACKED SEA's "+n2[i]+" FOR SECURITY REASONS!");
      // NOTE: SEA's official API is callback, not Promise. 
      return new Promise(function(res, rej){ // Should be callback style, temporary for now.
        cb = cb || function(){};
        var get = {opt: opt}, id = ''+Math.random();
        ask[id] = function(ack){
          if(!ack){ return }
          if(ack.err){
            console.log(ack.err);
            SEA.err = ack.err;
            cb(); res(); // rej() is handled by SEA, not the plugin.
            return;
          }
          cb(ack.put); res(ack.put);
        }
        window.postMessage({rpc:['SEA',method], get: get, '#': id}, "*");
      });
    }
  });
} catch(err) { console.log(err) }})();

}());
/* ------------------ POPUP ---------------------- */

$(document).on('click', handle);
async function handle(e){
	var target = e.target;
  if(!writable(e.target)){ return }
	if(written(e.target)){ return }
  both.runtime.sendMessage({rpc: 'ask', encrypt: 1, _:{I: 1}}, async function(ack){
  	if(!ack){ return }
    put(ack.say || ack.what || ack.put, target, e);
  });
};

function put(say, target, e){
                          //say = 'lol' + Math.random(); // TODO! remove!
  var n = $(target), tmp = n.closest('[contenteditable=true]');
  if(tmp.length){
    n.html(say);
    keypress(n);
  }
  tmp = n.closest('textarea, input');
  if(tmp.length){
    n.val(say);
    n.html(say);
    keypress(n);
  }
  var sel = window.getSelection();
  n = sel.anchorNode || sel.baseNode;
  if(!n){ return }
  if(isText(n)){
    n = $(n).parent();
  }
  n = $(n);
  tmp = n.closest('[contenteditable=true]');
  tmp.focus();
  if(tmp.length){
    n.html(say);
    keypress(n);
  }
  tmp = n.closest('textarea, input');
  if(tmp.length){
    n.val(say);
    keypress(n);
  }
}

function keypress(n, e){
  n = $(n)[0];
  //n.trigger('keydown').trigger('keypress').trigger('input').trigger('change').trigger('keyup');
  try{
  e = new Event('input', {bubbles: true, cancelable: true}); n.dispatchEvent(e);
  e = new Event('change', {bubbles: true, cancelable: true}); n.dispatchEvent(e);
  e = new KeyboardEvent("keydown", {bubbles: true, cancelable: true}); n.dispatchEvent(e);
  e = new KeyboardEvent("keypress", {bubbles: true, cancelable: true}); n.dispatchEvent(e);
  e = new KeyboardEvent("keyup", {bubbles: true, cancelable: true}); n.dispatchEvent(e);
  }catch(e){
    return;
  }
  return true;
}

function isText(n){
  return !n? false : (n.nodeType == 3 || n.nodeType == Node.TEXT_NODE);
}

function writable(ui){
  if(!ui){ return }
  ui = $(ui);
  if(ui.is('input')){ return }
  if((ui[0]||{}).isContentEditable){ return true }
  if(ui.is('textarea') || ui.attr('contenteditable')){ return true }
}
function written(ui){
  ui = $(ui);
	if(ui.is('textarea, input')){
    return ui.val();
  }
  return ui.text();
}
function hash(s){ // via SO
  if(typeof s !== 'string'){ return {err: 1} }
  var c = 0;
  if(!s.length){ return c }
  for(var i=0,l=s.length,n; i<l; ++i){
    n = s.charCodeAt(i);
    c = ((c<<5)-c)+n;
    c |= 0;
  }
  return c; // Math.abs(c);
}

setInterval(function check(i){
  var txt = $('body').text();
  var hsh = hash(txt);
  if(hash.last === hsh){ return }
  $(document).trigger('change');
  hash.last = hsh;
  var tmp = txt.indexOf('{"m":{"#":', i);
  if(0 > tmp){ return }

  $('body').find("*:not(iframe)").contents().filter(function(){
    return isText(this) &&
      !$(this).parent().is('script') &&
      $(this).text().trim()
  }).each(function(){
    var txt = $(this).text();
    var tmp = txt.indexOf('{');
    if(0 > tmp){ return };
    var obj = jsondom(this), el, color = '', size = '';
    if(!obj || !(el = obj.$) || !obj.m){ return }
    if(el.closest('input, textarea, [contenteditable=true]').length || writable(el)){ return }
    delete obj.$;
    el = el.closest('div, p, li, ul, ol, pre, :header, main, section, article, blockquote').first();
    $(document).trigger('party', {put: obj, $: el});
    both.runtime.sendMessage({rpc: 'hold', key: obj.m['#'], hold: obj, _:{I: 1}}, function(ack){
      if(!ack || !ack.height){ return }
      el.find('iframe').height(ack.height);
    });
    try{ color = btoa(el.css('color')) }catch(e){}
    try{ size = btoa(el.css('font-size')) }catch(e){}
    //el.html("<iframe src='"+both.runtime.getURL('frame.html')+"?color="+color+"&size="+size+"&width="+el.width()+"#"+obj.m['#']+"' style='border: 0; width: 100%; height: 2em; margin: 0; padding: 0;'></iframe>");
    el.html("<iframe src='"+both.runtime.getURL('frame.html')+"?color="+color+"&size="+size+"&width="+el.width()+"#"+obj.m['#']+"' style='border: 0; width: "+el.width()+"px; height: 2em; margin: 0; padding: 0;'></iframe>");
    //setTimeout(check, 1);
    //return false;
  });

}, 1000);

function jsondom(dom){
  dom = $(dom);
  if(!dom[0] || dom.is('body')){ return }
  var txt = dom.text();
  var tmp = txt.indexOf('{');
  if(0 > tmp){ return }
  return jsonloop(dom, txt, tmp, tmp);
}
function jsonloop(dom, txt, tmp, end){
  end = txt.indexOf('}', end);
  if(0 > end){ return jsondom($(dom).parent()) }
  var raw = txt.slice(tmp, ++end), obj;
  try{ obj = JSON.parse(raw) }catch(e){};
  if(!obj){ return jsonloop(dom, txt, tmp, end) }
  obj.$ = $(dom);
  return obj;
}

/* ------------------------------------------------- */
