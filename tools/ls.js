/* ES ls - list the available indices */

module.exports = async function(es,args,config,flags) {
	var d = await es.cat.indices({
		format: 'json',
		index:args[0] ||'*'
	});
	(await es.cat.aliases({
		format: 'json',
		name:args[0] ||'*'
	})).forEach(a => d.push({
		index: a.alias+" -> "+a.index,
		health:'cyan',
		alias:a
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