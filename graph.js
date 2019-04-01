var both;
try{both = browser}catch(e){}
try{both = both || chrome}catch(e){}

Gun.on('create', function(root){
	this.to.next(root);
	var opt = root.opt;
	if(root.once){ return }
	if(false === opt.sendMessage){ return }
	var q = [];

	/*root.on('put', function(at){
		this.to.next(at);
	});*/

	root.on('get', function(msg){
		this.to.next(msg);
		q.push(msg);
	});
	setInterval(function(){
		var tmp = q; q = [];
		both.runtime.sendMessage({rpc: 'tie', q: tmp, _:{I: 1}}, async function(ack){
			if(!ack.q || !ack.q.length){ return }
			ack.q.forEach(function(msg){
				root.on('in', msg);
			});
		})
	},50);
});

var gun = Gun({localStorage: false});
//$.as.route.page('graph', () => {
//	if(!S.user.is){ return $.as.route('sign') }
	//S.gun.get('@').time(async (data, key, time) => {
async function graph(get){
	if(!get){ return }
	// TODO: BUG!! switch from `on` to `once` to get Martti's {_} empty object bug.
	var $ul = $('#graph ul');
	//return;
	gun.get(get).map().get(1).on(async function(data){
		console.log('know:', data);
		var key = data.fbid || Gun.node.soul(data), tmp;
		if(!key){ return }
		var $li = $($('#k'+key)[0] || $('#graph .model .who').clone(true,true).attr('id', 'k'+key)[(tmp = $.as.sort(data.name||1, $ul.children('li').first()))[0]?'insertBefore':'appendTo'](tmp[0] || $ul));
		$li.find('.name').text(data.name);
		$li.find('.alias').text(data.alias);
		$li.find('.fbid').text(data.fbid);
		$li.find('.pub').text(data.pub);
		$li.find('img').attr('src', data.face);
		//$('html, body').stop(true, true).animate({scrollTop: $ul.height()});
	});
}
both.runtime.sendMessage({rpc: 'anonkey', encrypt: 1, _:{I: 1}}, async function(ack){
	graph(ack.anon);
});
//});