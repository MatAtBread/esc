/* ES cp - copy src to dest */

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve,seconds * 1000)) ;
}

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	var query = eval("("+args[1]+")") ;
	var idx = args[0] ;

	try {
		var task, dbq = await es.deleteByQuery({
			index: idx,
			conflicts: 'proceed',
			waitForCompletion: false,
			body:{
				query
			}
		});
		do {
			task = await es.tasks.get({ taskId: dbq.task }) ;
			if (task.error)
				throw {body: task.task.status, message: task.error.type+" "+task.error.reason+"\t"+task.task.description} ;
			var num = ((task.task.status.deleted / task.task.status.total) * 1000|0)/10+"%" ;
			num = num+"      ".slice(0,6-num.length) ;
			process.stdout.write(" "+num+"\x1B[7D") ;
			await sleep(1) ;
		}  while(!task.completed) ;
		process.stdout.write("       \x1B[7D") ;
		if (flags.verbose)
			console.log("Deleted "+task.task.status.deleted+" docs") ;
	} catch(ex) {
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

module.exports.help = "delete docs from <src> by '{query}'".magenta+" WARNING: cannot be reversed".red ;