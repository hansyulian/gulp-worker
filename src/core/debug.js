(function(debug) {

    var debugHandlers = [{
        name: "debug",
        level: 1
    }];

    var convertTypes = [
        "object"
    ]

    function injectDebugHandlers(context, name) {
        name = name || "debug";
        var debugLevels = {};
        debugContext = {};
        context[name] = debugContext;
        debugContext.levels = debugLevels;
        for (var i = 0; i < debugHandlers.length; i++) {
            var debugHandler = debugHandlers[i];
            var callback = debugHandler.callback || defaultDebugHandlerCallback(debugHandler, context);
            var wrappedCallback = wrapCallback(callback, debugHandler, debugContext, context);
            debugContext[debugHandler.name] = wrappedCallback;
            debugLevels[debugHandler.name] = debugHandler.level;

        }
    }

    function defaultDebugHandlerCallback(debugHandler, context) {
        var prefix = debugHandler.name.toUpperCase() + ": "
        return function(message) {
            ///cek type object
            if (convertTypes.indexOf(typeof(message)) != -1)
                message = convertJson(message);
            console.log(prefix + message);
        }
    }

    function convertJson(obj) {
        return JSON.stringify(obj, null, "\t");
    }

    function wrapCallback(callback, debugHandler, debugContext, context) {
        var handlerLevel = debugHandler.level;

        return function(message) {

            var contextLevel = context.config.debugLevel;
            if (isNaN(contextLevel))
                contextLevel = debugContext.levels[contextLevel] || 0;
            if (handlerLevel >= contextLevel && context.config.debug)
                callback(message);
        }
    }

    debug.debugHandlers = debugHandlers;
    debug.injectDebugHandlers = injectDebugHandlers;
})(module.exports = {});