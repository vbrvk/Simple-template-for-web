const gulp = require('gulp');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


function lazyTaskRequire(name, path, opt) {
	const setting = opt || {};
	gulp.task(name, (cb) => {
		// eslint-disable-line global-require
		const task = require(path).call(this, setting);
		return task(cb);
	});
}

// Styles
lazyTaskRequire('styles', './tasks/styles', {
	src: 'source/styles/*.scss',
	isDev: isDevelopment,
});

// Assets
lazyTaskRequire('assets', './tasks/assets', {
	src: 'source/assets/**/*',
});

// Clean
lazyTaskRequire('clean', './tasks/clean');

// Pug
lazyTaskRequire('pug', './tasks/pug', { src: 'source/templates/*.jade' });

// Build
gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('styles', 'assets', 'pug')
));

// Watch
gulp.task('watch', () => {
	gulp.watch('source/styles', gulp.series('styles'));
	gulp.watch('source/assets', gulp.series('assets'));
	gulp.watch('source/templates', gulp.series('pug'));
});

// Browser-sync
lazyTaskRequire('serve', './tasks/serve');

// ESlint
lazyTaskRequire('eslint', './tasks/eslint', {
	src: 'source/**/*.js',
});

// Dev
gulp.task('dev', gulp.series('build', 'eslint', gulp.parallel('watch', 'serve')));
