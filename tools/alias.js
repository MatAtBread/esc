/* ES rm - delete indices */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	var d = await es.indices.putAlias({
		name:args[0],
		index:args[1]
	});
	console.log(args[0],"->",args[1])
}

module.exports.help = "Create an <alias> for an <index-pattern>".magenta ;
