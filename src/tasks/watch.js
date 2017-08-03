(function(task, paths, colors) {

    function inject(gulp, context) {
        var works = context.works;
        var worker = context.worker;
        var initSettings = context.initSettings;
        var findFiles = paths.findFiles;

        gulp.task('watch', function() {
            for (var i = 0; i < works.length; i++) {
                var work = JSON.parse(JSON.stringify(works[i]));
                //if the gulpOnWatch set true, when console run gulp watch, the worker will be called once
                var gulpOnWatch = ("gulpOnWatch" in work.options) ? work.settings.gulpOnWatch : context.config.gulpOnWatch;
                if (gulpOnWatch)
                    worker(works[i], works[i].options, context);
                //initialize settings
                var additionalWatch = work.options.additionalWatch || [];
                if (typeof(additionalWatch) == "string")
                    additionalWatch = [additionalWatch];
                var watches = work.files.concat(additionalWatch);
                console.log(colors.cyan("\tStarting watch:\n"));
                console.log(colors.yellow("\t\tWatching Files:\n"));
                var settings = initSettings(work.options);
                var sources = findFiles(watches, settings.baseFolder, {
                    showLog: true
                });
                ! function(sources, work) {
                    gulp.watch(sources, function() {
                        console.log(colors.magenta("Changes detected, starting to rebuild files"));
                        worker(work, work.options, context);
                        console.log(colors.magenta("Rebuild from watch finished\n"));
                    });
                }(sources, work);
            }
        });

    }


    task.inject = inject;
})(module.exports = {}, require("../core/paths"), require("colors"));