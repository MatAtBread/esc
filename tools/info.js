/* ES rm - delete indices */

module.exports = async function(es,args,config,flags) {
	if (args.length) throw module.exports.help ;

	var d = await es.info({});
	console.log(d)
}

module.exports.help = "Show info about the host".magenta ;
