var gulp = require('gulp');

var sass = require('gulp-sass');
var react = require('gulp-react');

var path = {
	styleSrc: 'src/style/main.scss',
	styleDest: 'build/css/',
	styleWatch: 'src/style/**/*.scss',
	jsSrc: 'src/script/*.jsx',
	jsDest: 'build/js/',
	jsWatch: 'src/script/*.jsx'
};

gulp.task('sass', function(){
	gulp.src(path.styleSrc)
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest(path.styleDest))
})

gulp.task('js', function(){
	gulp.src(path.jsSrc)
		.pipe(react())
		.pipe(gulp.dest(path.jsDest))
})

gulp.watch(path.styleWatch, ['sass']);
gulp.watch(path.jsWatch, ['js']);

gulp.task('default', ['sass', 'js']);