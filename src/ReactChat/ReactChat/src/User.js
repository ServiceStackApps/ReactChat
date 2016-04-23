System.register(['react'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var User;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            }],
        execute: function() {
            User = (function (_super) {
                __extends(User, _super);
                function User() {
                    _super.apply(this, arguments);
                }
                User.prototype.render = function () {
                    return (React.createElement("div", {className: "user"}, React.createElement("img", {src: this.props.user.profileUrl || "/img/no-profile64.png"}), React.createElement("span", {onClick: this.props.onSelect}, this.props.user.displayName)));
                };
                return User;
            }(React.Component));
            exports_1("User", User);
        }
    }
});
//# sourceMappingURL=User.js.map