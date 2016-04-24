System.register(["react", './utils'], function(exports_1, context_1) {
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
    var React, utils_1;
    var Header;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            Header = (function (_super) {
                __extends(Header, _super);
                function Header() {
                    _super.apply(this, arguments);
                }
                Header.prototype.openChannel = function () {
                    var chan = prompt("Join another Channel?", "ChannelName");
                    if (chan)
                        location.href = "?channels=" + this.props.channels.concat([chan.replace(/\s+/g, "")]).join(",");
                };
                Header.prototype.selectChannel = function (e) {
                    this.props.selectChannel(e.target.getAttribute("data-channel"));
                };
                Header.prototype.render = function () {
                    var _this = this;
                    return (React.createElement("div", {id: "top"}, React.createElement("a", {href: "https://github.com/ServiceStackApps/LiveDemos"}, React.createElement("img", {src: "https://raw.githubusercontent.com/ServiceStack/Assets/master/img/artwork/logo-32-inverted.png", style: { height: "28px", padding: "10px 0 0 0" }})), React.createElement("div", {id: "social"}, React.createElement("div", {id: "welcome"}, this.props.activeSub
                        ? React.createElement("span", null, React.createElement("span", null, "Welcome, ", this.props.activeSub.displayName), React.createElement("img", {src: this.props.activeSub.profileUrl}))
                        : null), this.props.isAuthenticated
                        ? null
                        : React.createElement("span", null, React.createElement("a", {href: "/auth/twitter", className: "twitter"}), React.createElement("a", {href: "/auth/facebook", className: "facebook"}), React.createElement("a", {href: "/auth/github", className: "github"}))), React.createElement("ul", {id: "channels", style: { margin: "0 0 0 30px" }}, this.props.channels.map(function (channel) { return React.createElement("li", {className: _this.props.selectedChannel === channel ? "selected" : "", "data-channel": channel, onClick: _this.selectChannel.bind(_this)}, channel); }), React.createElement("li", {style: { background: "none", padding: "0 0 0 5px" }}, React.createElement("button", {onClick: this.openChannel.bind(this)}, "+")), React.createElement("li", {style: { background: "none", padding: 0 }}, React.createElement("span", {style: { fontSize: 13, color: "#ccc", paddingLeft: 10 }, onClick: this.props.clearMessages}, "clear")))));
                };
                Header = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        channels: state.channels,
                        selectedChannel: state.selectedChannel,
                        isAuthenticated: state.isAuthenticated,
                        activeSub: state.activeSub
                    }); }, function (dispatch) { return ({
                        selectChannel: function (channel) { return dispatch({ type: 'CHANNELS_SELECT', channel: channel }); },
                        clearMessages: function () { return dispatch({ type: 'MESSAGES_CLEAR' }); }
                    }); })
                ], Header);
                return Header;
            }(React.Component));
            exports_1("Header", Header);
        }
    }
});
//# sourceMappingURL=Header.js.map