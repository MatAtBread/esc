/* ES alias - create an alias from 1 or more indices */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	await es.indices.putAlias({
		name:args[0],
		index:args.slice(1)
	});
}

module.exports.help = "Create an <alias> for an <index-pattern>".magenta ;
