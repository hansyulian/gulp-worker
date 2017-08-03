(function(task) {

    var taskContexts = {};
    var taskList = [{
        "name": "default",
        "path": "../tasks/default"
    }, {
        "name": "watch",
        "path": "../tasks/watch"
    }]

    function initializeTasks(gulp, context) {
        var taskContexts = {};
        context.tasks = taskContexts;
        for (var i = 0; i < taskList.length; i++) {
            var taskContext = taskList[i];
            taskContexts[taskContext.name] = taskContext;
            initializeTaskContext(taskContext);

            var handler = taskContext.handler;
            handler.inject(gulp, context);
        }

    }

    function initializeTaskContext(context) {
        context.handler = require(context.path);
    }

    task.initializeTasks = initializeTasks;
})(module.exports = {})