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

A single `.` can be used to separate commands. For example, copy, alias and list the indices:

```
$ esc cp twitter twatter . alias twotter twatter . ls

twatter
twitter
twotter -> twatter
```
