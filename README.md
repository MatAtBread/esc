# escmd
ElasticSearch command line - create, delete, copy, manage indices and aliases 

`npm install -g escmd`

```
$ esc

alias - Create an <alias> for an <index-pattern>
cp - copy <src> index to <dest> index. Use --mappings to copy mappings as well
ls - list indices matching optional pattern. Use --verbose for more info on each index
rm - delete <index, alias or pattern>. WARNING: cannot be reversed
Use . to separate commands
```

## Options
--verbose   Generate noisy output (depends on the command(s) suuplied, if any) |
