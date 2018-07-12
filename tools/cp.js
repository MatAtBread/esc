/* ES cp - copy src to dest */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	var mappings ;
	if (!flags.nomappings)
		mappings = await es.indices.getMapping({ index: args[0] }) ;
	
	await es.indices.create({
		index: args[1],
		body:{
			mappings:mappings ? mappings[args[0]].mappings:undefined,
			settings: config.settings
		}
	}) ;

	try {
		await es.reindex({
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
	} catch(ex) {
		if (ex.body) {
			if (ex.body.created !== ex.body.total) {
				d = await es.indices.delete({
					index:args[1]
				});
				throw ("reindex "+args[0]+" into "+args[1]+" failed ("+ex.body.created+" of "+ex.body.total+" copied). Did you set --nomappings (not mappings)?").red ;
			}
		} else throw ex ;
	}
} ;

module.exports.help = "copy <src> index to <dest> index. Use --nomappings to copy docs only".magenta ;