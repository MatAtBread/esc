/* ES rm - delete indices */

module.exports = async function(es,args,config,flags) {
	if (!args.length) throw module.exports.help ;
	var d ;
	try {
		d = await es.indices.deleteAlias({
			name:args[0],
			index:'_all'
		});
	} catch(ex) {
		if (ex.statusCode === 404) {
			d = await es.indices.delete({
				index:args[0]
			});
		} else {
			throw ex ;
		}
	}
}

module.exports.help = "delete <index, alias or pattern>.".magenta+" WARNING: cannot be reversed".red ;