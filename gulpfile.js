// Use gulp
const gulp = require('gulp');
// Basic file functionality
const fs = require('fs');
// For cleaning previous output
const del = require('del');
// To minify JS
const minifyJS = require('gulp-minify');
// To minify CSS
//const minifyCSS = require('gulp-clean-css');
// For using templating abilities - variables, ifs, loops etc.
const nunjucks = require('gulp-nunjucks');
// For bypassing cache
const cacheBuster = require('gulp-cache-bust');
// SASS css compiler
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

// Read config.json if exists
if (fs.existsSync('config.json')) {
	var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} else {
	// Default values
	var config = {
		"source_dir": "src",
		"output_dir": "public",
		"kernel_version": "5.8.8-gnu_1",
		"iso_download_url": "http://localhost.test/iso",
	}
}
const sourcedir=config['source_dir'];
const outputdir=config['output_dir'];

gulp.task('images', async function () {
	gulp.src(sourcedir+'/assets/images/*.png')
		.pipe(gulp.dest(outputdir+'/assets/images'));
});

gulp.task('js', async function () {
	gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery-one-page-nav/jquery.nav.js'])
		.pipe(minifyJS({
			noSource: true,
			ext:{
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest(outputdir+'/assets/js'));
});

// Get some file to be included inline from template
// Usage: {{ inline_include('assets/js/inline/main.js')|safe }}
function template_inline_include(filename) {
	if (!fs.existsSync(sourcedir+'/'+filename)) {
		return false;
	}
	if (filename.endsWith('.css')) {
		return '<style>'+fs.readFileSync(sourcedir+'/'+filename).toString()+'</style>';
	} else if (filename.endsWith('.js')) {
		return '<script>'+fs.readFileSync(sourcedir+'/'+filename).toString()+'</script>';
	} else {
		return fs.readFileSync(sourcedir+'/'+filename).toString();
	}
}

gulp.task('css', async function () {
	// CSS
	gulp.src(sourcedir+'/assets/css/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		//.pipe(minifyCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest(outputdir+'/assets/css'));
	// Font
	gulp.src(sourcedir+'/assets/fonts/*.ttf')
		.pipe(gulp.dest(outputdir+'/assets/fonts'));
});

//gulp.task('html', gulp.series('js', 'css'), async function () {
gulp.task('html', async function () {
	// HTML output
	gulp.src(sourcedir+'/*.html')
		.pipe(cacheBuster({
			basePath: outputdir+'/'
		}))
		.pipe(nunjucks.compile({
				kernel_version: config['kernel_version'],
				inline_include: template_inline_include,
				iso_download_url: config['iso_download_url']
			}))
		.pipe(gulp.dest(outputdir));
	// Favicon
	gulp.src(sourcedir+'/favicon.ico')
		.pipe(gulp.dest(outputdir));
});

// Cleans the old output
gulp.task('clean', async function() {
	return del([
		outputdir+'/index.html',
		outputdir+'/assets',
		outputdir+'/favicon.ico'
	], {
		// In some cases this is needed for successful delete
		force:true
	});
});

gulp.task('default', async function(){
	gulp.series('js', 'images', 'css', 'html')();
});
