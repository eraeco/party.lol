var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}
both.RPC = {};

both.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
		setTimeout(function(){ 
			window.open('./options.html'); // first install
		}, 750);
		populate();
  }else if(details.reason == "update"){
		var thisVersion = both.runtime.getManifest().version;
		console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});

both.runtime.onMessage.addListener(function(msg, info, ack){ var tmp;
	//console.log("background:", msg);
	msg._ = msg._ || {};
	if(tmp = msg.rpc){
		if(!(tmp = both.RPC[tmp] || both.RPC[tmp[0]])){ return } // Error?
		tmp(msg, ack, info);
		return true;
	}
	return true;
});

both.runtime.onSuspend.addListener(function() {
  console.log("Suspended");
});

var opt, user, gun;
;(async function(){ // login!
//localStorage.clear();sessionStorage.clear();
try{ opt = JSON.parse(localStorage['party-config']) }catch(e){}
opt = opt || {};
opt.gun = opt.gun || {};
opt.gun.localStorage = false;
gun = Gun(opt.gun);
gun.on('auth', function(ack){ console.log('logged in') });
if(opt.pair){
	user = gun.user().auth(opt.pair);
} else
if(opt.alias && opt.remember){
	user = gun.user().auth(opt.alias, opt.remember);
} else {
	opt.pair = await SEA.pair(); // new account every time!
	user = gun.user().auth(opt.pair);
	opt.gun = opt.gun || {};
	try{ localStorage['party-config'] = JSON.stringify(opt) }catch(e){}
}
}());

/* --------------------------- */

both.RPC.ask = function(msg, ack){
	if(!msg || 'ask' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	ask("What would you like to say?", async function(_){
		if(msg.encrypt){
			_.say = await encrypt(_.say);
			_.say = await say(_) || _.say;
		}
		ack(_);
	}, {any: 'any', width: 600})
}

/* --------------------------- */

both.RPC.sync = async function(msg, ack, info){try{
	if(!msg || 'sync' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	if(!user || !user.is){ return }
	var know = msg.put, ref;
	if(!know){ return }
	var anon = await anonkey();
	var data = know; //Gun.text.ify(know);
	if(know.fbid){
		ref = gun.get(anon).get(low(know.fbid)).get(1).put(data);
	}
	if(know.alias){
		//console.log(low(know.fbid), low(know.alias), ref, data);
		tmp = gun.get(anon).get(low(know.alias)).get(1).put(ref||data);
		ref = ref || tmp;
	}
	if(know.name){
		tmp = gun.get(anon).get(low(know.name)).get(1).put(ref||data);
	}
}catch(e){console.log(e)}}
both.RPC.pub = async function(msg, ack, info){try{
	if(!msg || 'pub' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	if(!user || !user.is){ return }
	var pub, tmp = msg.put;
	if(!tmp){ return }
	if(!(tmp = tmp.m)){ return }
	if(!(tmp = tmp['#'])){ return }
	pub = SEA.opt.pub(tmp);
	if(!pub){ return }
	var know = msg.know, ref;
	if(!know){ return }
	if(!know.id){ return }
	var anon = await anonkey();
	//return;
	var ref = gun.get(anon).get(low(know.id)).get(1);
	var is = await ref.then();
	if(is.fbid != know.id){ return }
	if(is.alias === know.alias || is.name === know.name){
		ref.get('pub').put(pub);
	}
	//console.log("CHECK PUB KEY:", is, know);
	return;
}catch(e){console.log(e)}}
async function anonkey(){
	if(anonkey.tmp){
		return anonkey.tmp;
	}
	var pair = (user._||{}).sea, pub = user.is.pub, enc;
	var key = await user.get('trust').get(pub).get('knows').then();
	key = await SEA.decrypt(key, pair);
	if(!key){
    key = SEA.random(24).toString('base64');
    enc = await SEA.encrypt(key, pair);
    user.get('trust').get(pub).get('knows').put(enc);
  }
	return anonkey.tmp = key;
}
both.RPC.anonkey = async function(msg, ack){
	if(!msg || 'anonkey' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	ack({anon: await anonkey()});
}
/*
user = {
	knows: {
		name: {
			'alice berry': {
				1: {#pubkey},
				2: {#pubkey},
				3: {#fbid}
			},
			'stanford'
		}
	}
}
*/
async function sha(t){
	return await SEA.work(t, null, null, {name: 'SHA-256'})
}
function low(t) {
  return ((''+t)||'').toLowerCase().replace(
    /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, 
    function (str, a, c, e, i, n, o, s, u, y, ae) {
      if (a) return 'a';
      if (c) return 'c';
      if (e) return 'e';
      if (i) return 'i';
      if (n) return 'n';
      if (o) return 'o';
      if (s) return 's';
      if (u) return 'u';
      if (y) return 'y';
      if (ae) return 'ae';
    }
  );
}

function get(obj, at){
	if(!obj){ return }
	if(!at || !at.length){ return obj }
	return get(obj[at.shift()], at);
}

/* --------------------------- */

async function encrypt(msg){
	if(!opt.custom){
		var x = SEA.random(12).toString('base64'), y = SEA.random(12).toString('base64');
		console.log("??????");
		console.log(SEA.random(12));
		var key = await SEA.work(x, y);//, null, {iterations: 500000}) // half million iteration = half second on mac air
		var enc = await SEA.encrypt(msg, key, null, {raw: 1});
		enc.v = 1;
		enc.w = x+'.'+y;
		return JSON.stringify(enc);
	}
	return;
}

async function decrypt(msg){
	if(!msg){ return }
	var dec = msg.m || msg;
	dec = dec[':'] || dec;
	if(!opt.custom){
		var work = dec.w;
		if(work){
			work = work.split('.');
			var slowSurveillanceToAGrindingHalt = await SEA.work(work[0], work[1]);//, null, {iterations: 500000});
			// oh hey, hi! Its you, Mr. Tyranny & Ms. Greed! Thought you'd peep on our code, huh?
			// WE DO NOT GIVE YOU PERMISSION TO ACCESS ANY PERSON'S DATA, doing so may cause you to knowingly violate laws, such as making unauthorized copies or caches or other of a person's data, such as copyright infringement in the USA - even if you have non-exclusive rights to the encrypted form of the data, YOU ARE NOT AUTHORIZED to access, attempt to access, or have gained access to the decrypted data, doing so will be considered as trespassing, abuse or misconduct of computer use, and theft or fraud from obtaining value of a person's data.
			dec = await SEA.decrypt(dec, slowSurveillanceToAGrindingHalt);
			return dec;
		}
		return msg;
	}
	return;
}

/* --------------------------- */

async function say(msg){
	if(!msg.say){ return }
	var ref = user.get('who').get('all').set({what: msg.say});
	user.get('who').get('said').set(ref);
	if(false){ return }
	var tmp = await ref.then(), mix = gun._.graph[tmp = Gun.node.soul(tmp)];
	if(!mix){ return }
	mix = SEA.opt.pack(mix.what,'what',mix,tmp);
	if(!mix){ return }
	return mix = (opt.introduce || "Want to join my private party? Install http://party.lol to read my secret post:")+"\n"+JSON.stringify(mix);
	//return mix = (opt.introduce || "Want to join my private party? Install http://party.lol to read my secret post:")+"\n```\n"+JSON.stringify(mix)+"\n```";
}
say.key = async function(){
	var mo = ':'+say.now().slice(0,2).join('.');
	if(mo === say.mo && say.tmp){
		return say.tmp;
	}
	var pair = (user._||{}).sea, pub = user.is.pub, enc;
	var key = await user.get('trust').get(pub).get(mo).then();
	key = await SEA.decrypt(key, pair);
	if(!key){
    key = SEA.random(12).toString('base64');
    enc = await SEA.encrypt(key, pair);
    user.get('trust').get(pub).get(mo).put(enc);
  }
  say.mo = mo;
	return say.tmp = key;
}
say.now = function(t){
	return new Date(t || Gun.state()).toISOString().split(/[\-t\:\.z]/ig).slice(0,-1);
}

/* --------------------------- */

both.RPC.SEA = function(msg, ack){
	if(!msg || !msg.rpc || 'SEA' !== msg.rpc[0]){ return }
  var tmp = msg.put || msg.get;
  var u, cb = function(data){
    if(u === data){
    	return ack({err: SEA.err || "SEA Error"});
    }
    ack({put: data});
  }
  try{
  if(msg.put){ 
    SEA[msg.rpc[1]](tmp.data, tmp.pair, cb, tmp.opt);
  } else
  if(msg.get){
    SEA[msg.rpc[1]](cb, tmp.opt);
	}
	}catch(err){
		SEA.err = err;
		cb();
	}
}

function ask(q, cb, opt){
	if(ask.lock){
		if(ask.ui && !ask.ui.closed){
			cb(false, "Already asking User something else.");
			ask.ui.focus();
			return;
		}
	}
	opt = (opt === true)? {any: 'any'} : (opt || {});
	ask.lock = true;
	ask.last = cb;
	opt.width = opt.width || 450;
	opt.height = opt.height || 400;
	var tmp = ask.ui = window.open("popup.html#" + (opt.any || 'ask'), "Answer", "chrome=yes,centerscreen=yes,dialog=yes,dependent=yes,titlebar=no,alwaysRaised=yes,width="+opt.width+",height="+opt.height+",left="+((screen.width/2)-(opt.width/2))+",top="+((screen.height/2)-(opt.height/2))+",");
	if(ask.ui){
		ask.ui.ASK = q;
		ask.ui.focus() 
	}
	setTimeout(function(){
		if(!tmp || !tmp.document || !tmp.document.hasFocus()){ // fix vanishing glitch.
			ask.lock = false;
			ask(q, cb, opt)
		}
	},100);
}

/* --------------------------- */

both.RPC.say = function(msg, ack){
	if(!msg || 'say' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	if(!ask.last){ return }
	if(ask.ui){ ask.ui.close() }
	ask.lock = ask.ui = false;
	ask.last(msg._);
}

/* --------------------------- */

both.RPC.gun = function(msg, ack){
	if(!msg || 'gun' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	//gun.on('in', msg.data || msg);
}

/* --------------------------- */

/* --------------------------- */

both.RPC.tie = function(msg, ack){
	if(!msg || 'tie' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	if(msg.q && msg.q.length){
		msg.q.forEach(function(msg){
			gun.on('in', msg);
		})
	}	
	//if(tie.q && tie.q.length){
		var tmp = tie.q; tie.q = [];
		ack({q: tmp});
	//}
}
var tie = {q: []};
gun.on('out', function(msg){
	this.to.next(msg);
	tie.q.push(msg);
})

/* --------------------------- */

both.RPC.toss = async function(msg, ack){
	if(!msg || 'toss' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	var u, toss = {what: hold[msg.key]};
	if(msg.decrypt){
		toss.what = await decrypt(toss.what);
	}
	ack(toss);
}

var hold = {}, stack = {};
both.RPC.hold = async function(msg, ack){
	if(!msg || 'hold' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	var key = msg.key;
	hold[key] = msg.hold;
	stack[key] = ack;
	setTimeout(function(){
		delete hold[key];
		delete stack[key];
	}, 1000 * 60 * 5);
}

both.RPC.height = function(msg, ack){
	if(!msg || 'height' !== msg.rpc){ return }
	if(!msg._.I){ return } // Error?
	var key = msg.key, to = stack[msg.key];
	if(!to){ return }
	to(msg);
	delete hold[key];
	delete stack[key];
}

/* --------------------------- */
function populate(){

	both.tabs.query({}, function(tabs){
		setTimeout(function each(){
			var tab = tabs.pop();
			if(!tab){ return }
			both.tabs.reload(tab.id);
			setTimeout(each, 250);
		},250);
	});

}
/* --------------------------- */

// experiment
;(function(){
  var scope = {};
  // SEA's official API is callback, with optional Promise support.
  // BOTH OF THESE ARE EXPERIMENTAL, NOT OFFICIAL API COMPATIBLE YET!
  SEA.I = function(cb, opt){
    return new Promise(async function(res, rej){
      opt = opt || {};
      cb = cb || function(){};
      //var yes = confirm("dApp wants to act on your behalf. OK? "+(opt.how||'')+' '+(opt.why||''));
      ask("dApp wants to act on your behalf. OK? "+(opt.how||'')+' '+(opt.why||''), async function(ack){
	      if(!ack.say){
	        rej(SEA.err = "User says no. " + (ack.why||ack.err||''));
	        return;
	      }
	      var tmp = scope.pair = scope.pair || await gen();
	      cb(tmp); res(tmp);
      });
    }, opt);
  }
  SEA.name = function(cb, opt){
    return new Promise(async function(res, rej){
      opt = opt || {};
      cb = cb || function(){};
	    //var yes = confirm("dApp wants to know your name. OK? "+(opt.how||'')+' '+(opt.why||''));
      ask("dApp wants to know your name. OK? "+(opt.how||'')+' '+(opt.why||''), async function(say){
	      if(!say.yes){
	        rej(SEA.err = "User says no." + (why||''));
	        return;
	      }
	      var tmp = '~'+(scope.pair = scope.pair || await gen()).pub; // ~ is SEA pubkey namespace.
	      cb(tmp); res(tmp);
    	}, opt);
    });
  }
  async function gen(){
  	if(user && user._.sea){
  		return user._.sea;
  	}
    var json = prompt("Import existing pair? (as JSON)");
    return scope.pair = json? JSON.parse(json) : await SEA.pair();
  }
}());