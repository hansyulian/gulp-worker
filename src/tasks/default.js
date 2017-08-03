(function(task) {

    function inject(gulp, context) {
        var works = context.works;
        var worker = context.worker;

        gulp.task('default', function() {
            for (var i = 0; i < works.length; i++) {
                var returns = worker(works[i], works[i].options, context);
            }
        })
    }


    task.inject = inject;
})(module.exports = {});