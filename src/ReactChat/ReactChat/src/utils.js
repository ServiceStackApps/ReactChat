System.register(['react-redux'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var react_redux_1;
    function reduxify(mapStateToProps, mapDispatchToProps) {
        return function (target) { return (react_redux_1.connect(mapStateToProps, mapDispatchToProps)(target)); };
    }
    exports_1("reduxify", reduxify);
    return {
        setters:[
            function (react_redux_1_1) {
                react_redux_1 = react_redux_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=utils.js.map