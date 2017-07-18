(function(defaultTask) {

    function inject(gulp, worker, works, options) {

        gulp.task('default', function() {
            for (var i = 0; i < works.length; i++) {
                var returns = worker(works[i].files, works[i].options, works[i].type);
            }
        })
    }


    defaultTask.inject = inject;
})(module.exports = {});