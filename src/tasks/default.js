var defaultTask = module.exports = {};
(function(defaultTask) {

    function inject(gulp, works, options) {

        gulp.task('default', function() {
            for (var i = 0; i < works.length; i++) {
                ///////////////continue here first
            }
        })
    }


    defaultTask.inject = inject
})(defaultTask);