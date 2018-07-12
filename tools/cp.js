/* ES cp - copy src to dest */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	var mappings ;
	if (flags.mappings)
		mappings = await es.indices.getMapping({ index: args[0] }) ;
	
	await es.indices.create({
		index: args[1],
		body:{
			mappings:mappings ? mappings[args[0]].mappings:undefined,
			settings: config.settings
		}
	}) ;

	var d = await es.reindex({
		refresh: true,
		body:{
			source: {
				index: args[0]
			},
			dest: {
				index: args[1]
			}		
		}
	});
} ;

module.exports.help = "copy <src> index to <dest> index. Use --mappings to copy mappings as well".magenta ;