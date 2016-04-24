System.register(['react', './utils', './User'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var React, utils_1, User_1;
    var Sidebar;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (User_1_1) {
                User_1 = User_1_1;
            }],
        execute: function() {
            Sidebar = (function (_super) {
                __extends(Sidebar, _super);
                function Sidebar() {
                    _super.apply(this, arguments);
                }
                Sidebar.prototype.render = function () {
                    var _this = this;
                    var height = this.props.hideExamples ? "25px" : "auto";
                    var label = this.props.hideExamples ? "show" : "hide";
                    return (React.createElement("div", {id: "right"}, React.createElement("div", {id: "users"}, this.props.users.map(function (user) { return React.createElement(User_1.User, {key: user.userId, user: user, onSelect: function () { return _this.props.onUserSelected(user); }}); })), React.createElement("div", {id: "examples", style: { height: height }}, React.createElement("span", {style: { position: "absolute", top: "2px", right: "7px" }, onClick: this.props.toggleExamples}, label), React.createElement("span", {onClick: function (e) { return _this.props.onCommandSelected(e.target.innerHTML); }}, React.createElement("h4", null, React.createElement("a", {href: "https://github.com/ServiceStackApps/Chat#global-event-handlers"}, "Example Commands")), React.createElement("div", null, "/cmd.announce This is your captain speaking ..."), React.createElement("div", null, "/cmd.toggle$#channels"), React.createElement("h4", null, React.createElement("a", {href: "https://github.com/ServiceStackApps/Chat#modifying-css-via-jquery"}, "CSS")), React.createElement("div", null, "/css.background-image url(http://bit.ly/1oQqhtm)"), React.createElement("div", null, "/css.background-image url(http://bit.ly/1yIJOBH)"), React.createElement("div", null, "@me /css.background #eceff1"), React.createElement("div", null, "/css.background$#top #673ab7"), React.createElement("div", null, "/css.background$#bottom #0091ea"), React.createElement("div", null, "/css.background$#right #fffde7"), React.createElement("div", null, "/css.color$#welcome #ff0"), React.createElement("div", null, "/css.visibility$img,a hidden"), React.createElement("div", null, "/css.visibility$img,a visible"), React.createElement("h4", null, React.createElement("a", {href: "https://github.com/ServiceStackApps/Chat#receivers"}, "Receivers")), React.createElement("div", null, "/tv.watch http://youtu.be/518XP8prwZo"), React.createElement("div", null, "/tv.watch https://servicestack.net/img/logo-220.png"), React.createElement("div", null, "@me /tv.off"), React.createElement("div", null, "/document.title New Window Title"), React.createElement("div", null, "/cmd.addReceiver window"), React.createElement("div", null, "/window.location http://google.com"), React.createElement("div", null, "/cmd.removeReceiver window"), React.createElement("h4", null, React.createElement("a", {href: "https://github.com/ServiceStackApps/Chat#jquery-events"}, "Triggers")), React.createElement("div", null, "/trigger.customEvent arg")))));
                };
                Sidebar = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        users: state.users,
                        hideExamples: state.hideExamples
                    }); }, function (dispatch) { return ({
                        toggleExamples: function () { return dispatch({ type: 'EXAMPLES_TOGGLE' }); }
                    }); })
                ], Sidebar);
                return Sidebar;
            }(React.Component));
            exports_1("Sidebar", Sidebar);
        }
    }
});
//# sourceMappingURL=Sidebar.js.map