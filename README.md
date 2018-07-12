# escmd
ElasticSearch command line - create, delete, copy, manage indices and aliases 

`npm install -g escmd`

```
$ esc

alias - Create an <alias> for an <index-pattern>
cp - copy <src> index to <dest> index. Use --nomappings to copy docs only
ls - list indices matching optional pattern. Use --verbose for more info on each index
mv - move <src> index to <dest> index. Use --nomappings to move docs only (not mappings)
rm - delete <index, alias or pattern...>. WARNING: cannot be reversed
Use . to separate commands
```

## Options
--verbose   Generate noisy output (depends on the command(s) suuplied, if any) |

A single `.` can be used to separate commands. For example, copy, alias and list the indices:

```
$ esc cp twitter twatter . alias twotter twatter . ls

twatter
twitter
twotter -> twatter
```
