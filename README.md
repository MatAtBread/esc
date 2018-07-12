# escmd
ElasticSearch command line - create, delete, copy, manage indices and aliases 

`npm install -g escmd`

```
$ esc

alias - Create an <alias> for an <index-pattern>
cp - copy <src> index to <dest> index. Use --nomappings to copy docs only
info - show basic info about the host (useful to check you're working on teh right cluster)
ls - list indices matching optional pattern. Use --verbose for more info on each index
mv - move <src> index to <dest> index. Use --nomappings to move docs only (not mappings)
rm - delete <index, alias or pattern...>. WARNING: cannot be reversed
Use . to separate commands
```

## Options
`--host=<url>`
Set the host name for all subsequent operations

`--verbose`
Generate noisy output (depends on the command(s) suuplied, if any)

`--settings.index=number_of_shards:X,number_of_replicas:Y`
Set the default values when an index is created

`--trace`
Show detailed ES library logging

A single `.` can be used to separate commands. For example, copy, alias and list the indices:

```
$ esc cp twitter twatter . alias twotter twatter . ls

twatter
twitter
twotter -> twatter
```

## Contributing
Add new commands in the `tools/` dieectory, using the same name as the command you want to create. The module should export a single `async function` which receives four parameters:

* an Elasticsearch client object (see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
* an array of string arguments
* the 'config' object, representing the settings perserved in `~/.esc.json`
* the 'flags' object, representing the values passed in arguments beginning with `--`

It's nice to set `module.exports.help` to an informative string do `esc` by itself can describe your command.

Your function should run to completion (`await` is allowed) and return. The return value is not used. Exceptions are handled by `esc` and you don't need to handle 
everything - `esc` will try and print something useful in any case. Throwing a string (as opposed to an `Error` object) will terminate execution and print the string to stderr.

Here's `tools/alias.js` to show you how simple it is.

```javascript
/* ES alias - create an alias from 1 or more indices */

module.exports = async function(es,args,config,flags) {
	if (args.length < 2) throw module.exports.help ;

	await es.indices.putAlias({
		name:args[0],
		index:args.slice(1)
	});
}

module.exports.help = "Create an <alias> for an <index-pattern>".magenta ;
```

