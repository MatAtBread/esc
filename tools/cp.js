/* ES cp - copy src to dest */

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve,seconds * 1000)) ;
}

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	var m = args[0].match(/(^https?:\/\/[^/]*)\/(.*)/) ;
	var remote = m ? m[1]:null ;
	var esSrc = remote ? es.remoteClient(remote) : es ;
	var src = m ? m[2]:args[0] ;

	var mappings ;
	if (!flags.nomappings) {
		mappings = await esSrc.indices.getMapping({ index: src }) ;
		await es.indices.create({
			index: args[1],
			body:{
				mappings:mappings ? mappings[src].mappings:undefined,
				settings: config['settings.index']
			}
		}) ;
	}
	
	var body = {
		wait_for_completion: false,
		refresh: true,
		body:{
			source: {
				index: src,
				query: flags.query ? JSON.parse(flags.query) : undefined
			},
			dest: {
				index: args[1]
			}		
		}
	};
	
	if (m) 
		body.body.source.remote = { host: remote } ;

	try {
		var task, reindex = await es.reindex(body);
		do {
			task = await es.tasks.get({ taskId: reindex.task }) ;
			if (task.error)
				throw {body: task.task.status, message: task.error.type+" "+task.error.reason+"\t"+task.task.description} ;
			var num = ((task.task.status.created / task.task.status.total) * 1000|0)/10+"%" ;
			num = num+"      ".slice(0,6-num.length) ;
			process.stdout.write(" "+num+"\x1B[7D") ;
			await sleep(1) ;
		}  while(!task.completed) ;
		process.stdout.write("       \x1B[7D") ;
	} catch(ex) {
		console.warn("Possibly truncated index "+args[1]+" created!") ;
		if (ex.body) {
			if (!ex.body.created)
				throw ex ;
			if (ex.body.created !== ex.body.total) {
				throw ("reindex "+args[0]+" into "+args[1]+" failed ("+ex.body.created+" of "+ex.body.total+" copied). Did you set --nomappings (not mappings)?").red ;
			}
		} else {
			throw ex ;
		}
	}
} ;

module.exports.help = "copy <src> index to <dest> index. Use --nomappings to copy docs only".magenta ;