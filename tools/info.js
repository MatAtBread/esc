/* ES rm - delete indices */

module.exports = async function(es,args,config,flags) {
	if (args.length) throw module.exports.help ;

	console.log("Config".cyan,config) ;
	console.log("Flags".cyan,flags) ;

	var d = await es.info({});
	console.log("ES".cyan,d)
}

module.exports.help = "Show info about the host".magenta ;
