/* ES ls - list the available indices */

module.exports = async function(es,args,config,flags) {
	args[0] = args[0] || '*' ;
	var isWild = args[0].indexOf("*")>=0 ;
	
	var d = (await es.cat.indices({
		format: 'json',
		index:args[0]
	})).filter(c => isWild || c.index==args[0]);
	var a = (await es.cat.aliases({
		format: 'json',
		name:args[0]
	})).reduce((a,b)=>{
		if (isWild || b.alias==args[0]) {
			a[b.alias] = a[b.alias] || { index:[] } ;
			a[b.alias].index.push(b.index) ;
		}
		return a ;
	},{}) ;

	Object.keys(a).forEach(alias => d.push({
		index: alias+" -> "+a[alias].index.join(' '),
		health:'cyan'
	})) ;
	d.sort((a,b)=>a.index<b.index?-1:a.index>b.index?1:0) ;
	if (flags.verbose)
		console.log(d.map(i => [i.index[i.health],i['docs.count'],i['store.size'],i.status].join('\t')).join('\n')) ;
	else if (process.stdout.isTTY) {
		console.log(d.map(i => i.index[i.health]).join('\n')) ;
	} else {
		console.log(d.map(i => i.index).join(' ')) ;
	}
};

module.exports.help = "list indices matching optional pattern. Use --verbose for more info on each index".magenta ;