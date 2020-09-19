# Ymir website

To setup:

```
npm i -g gulp-cli
cd /path/to/this/repo
# if not on x86_64 you may have to run: npm rebuild node-sass
# if doesn't work, delete the node_modules/node-sass folder and run: npm install
# rm -rf node_modules/node-sass && npm install
npm install
gulp clean
gulp
```

Optionally, create a `config.json` file with contents like below then run `gulp` to generate:

```
{
	"source_dir": "src",
	"output_dir": "public",
	"kernel_version": "5.8.8-gnu_1",
	"iso_download_url": "http://somedomain.test/iso"
}
```

Then visit `index.html`


## Troubleshooting

### `Node Sass could not find a binding for your current environment`

This should not happen on a clean install. This indicates that the architecture is not compatible with node-sass package contents in node_modules.

```
rm -rf node_modules/node-sass && npm install
```

Or consult [here](https://stackoverflow.com/questions/37986800/node-sass-couldnt-find-a-binding-for-your-current-environment).

### `Illegal instruction] | diffTrees: sill install generateActionsToTake`

The architecture is not right for npm/node.js or something. [source](https://stackoverflow.com/a/58371522)

I've had success with `pnpm` on that case.

### `Error: ENOENT: no such file or directory, open 'public/assets/js/jquery.nav.min.js'`

Sometimes (presumably on slow machines) this message may appear when `gulp` is run after a clean clone or running `gulp clean`. The workaround is to run `gulp` again when that happens.
