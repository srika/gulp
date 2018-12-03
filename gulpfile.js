var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sm = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var less = require('gulp-less');
var lessprefix = require('less-plugin-autoprefix');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var imageminpng = require('imagemin-pngquant');
var jpegimagemin = require('imagemin-jpeg-recompress');

var lp = new lessprefix({
    browsers: ['last 2 versions']
})

var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

var handlebars = require('gulp-handlebars');
var hlib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');
var del = require('del');

var ts = require('gulp-typescript');
var tspro = ts.createProject("tsconfig.json");



gulp.task('tsdemo', function(){
    return tspro.src()
    .pipe(tspro())
    .js.pipe(gulp.dest("dist"))
})

//for CSS
/* gulp.task('styles', function(){
    console.log('styles task in progress');

    return gulp.src(['public/css/reset.css',CSS_PATH])
    .pipe(plumber(function(err){
        console.log('styles error');
        console.log(err);
        this.emit('end')
    }))
    .pipe(sm.init())
    .pipe(autoprefix())
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(sm.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());     
}); */

//********* For SCSS

/* gulp.task('styles', function(){
    console.log('styles task in progress');

    return gulp.src('public/scss/styles.scss')
    .pipe(plumber(function(err){
        console.log('styles error');
        console.log(err);
        this.emit('end')
    }))
    .pipe(sm.init())
    .pipe(autoprefix())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(sm.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());     
}); */

//********** for LESS
gulp.task('styles', function(){
    console.log('styles task in progress');

    return gulp.src('public/less/styles.less')
    .pipe(plumber(function(err){
        console.log('styles error');
        console.log(err);
        this.emit('end')
    }))
    .pipe(sm.init())
    .pipe(autoprefix())
    .pipe(less({
        plugins: [lp]
    }))
    .pipe(sm.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());     
});


gulp.task('scripts', function(){
    console.log('scripts task in progress');
    
    return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err){
        console.log(err);
        this.emit('end')
    }))
    .pipe(sm.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('scriptsall.js'))
    .pipe(sm.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('images', function(){
    
    return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
        [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminpng(),
            jpegimagemin()
        ]
    ))
    .pipe(gulp.dest(DIST_PATH + '/images'))
      
});

gulp.task('templates', function(){
    return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
        handlebars: hlib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
        namespace: 'templates',
        noRedeclare: true
    }))
    .pipe(concat('template.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());

})

gulp.task('default',['clean','images','templates','styles','scripts'], function(){
    console.log('default task in progress');
      
});

gulp.task('clean', function(){
    
    return del.sync([
        DIST_PATH
    ])
    
      
});

gulp.task('watch',['default'], function(){
    console.log('starting server in watch mode');
    require('./server.js');
    livereload.listen();
    //gulp.watch(CSS_PATH, ['styles'])
    //gulp.watch('public/scss/**/*.scss', ['styles'])
    gulp.watch('public/less/**/*.less', ['styles'])
    //gulp.watch(SCRIPTS_PATH, ['scripts'])
    gulp.watch(TEMPLATES_PATH, ['templates'])
      
});

