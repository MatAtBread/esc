/* ES rm - delete indices */

module.exports = async function(es,args,config,flags) {
	if (!args.length) throw module.exports.help ;
	var d ;
	for (var i=0; i<args.length; i++) {
		var idx = args[i] ;
		try {
			d = await es.indices.deleteAlias({
				name:idx,
				index:'_all'
			});
		} catch(ex) {
			if (ex.statusCode === 404) {
				d = await es.indices.delete({
					index:idx
				});
			} else {
				throw ex ;
			}
		}
	}
}

module.exports.help = "delete <index, alias or pattern...>.".magenta+" WARNING: cannot be reversed".red ;