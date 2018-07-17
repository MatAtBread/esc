/* ES cp - copy src to dest */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	if (args[0]===args[1]) {
		// Move to myself is a special case - we do the copy/reindex since we've been asked to
		// Do a copy
		var dest = args[1]+"-"+process.pid ;
		await require('./cp')(es,[args[0],dest],config,flags) ;
		// Then delete the src
		await require('./rm')(es,[args[0]],config,flags) ;
		await require('./cp')(es,[dest,args[0]],config,flags) ;
		await require('./rm')(es,[dest],config,flags) ;
	} else {
		// Do a copy
		await require('./cp')(es,args,config,flags) ;
		// Then delete the src
		await require('./rm')(es,[args[0]],config,flags) ;
	}
} ;

module.exports.help = "move <src> index to <dest> index. Use\n\t"+"--nomappings".cyan+" to copy docs only. \n\t'".magenta+"--query={}".cyan+"' to limit src docs".magenta ;