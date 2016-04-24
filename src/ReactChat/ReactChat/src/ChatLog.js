System.register(['react', './User', './utils'], function(exports_1, context_1) {
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
    var React, User_1, utils_1;
    var ChatLog;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (User_1_1) {
                User_1 = User_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            ChatLog = (function (_super) {
                __extends(ChatLog, _super);
                function ChatLog() {
                    _super.apply(this, arguments);
                }
                ChatLog.prototype.renderItem = function (m, i, msgs) {
                    var user = this.props.users.filter(function (user) { return (user.userId === m.userId); })[0];
                    var clsHighlight = m.msg.indexOf(this.props.activeSub.displayName.replace(" ", "")) >= 0
                        ? "highlight "
                        : "";
                    var msgId = "m_" + (m.id || "0");
                    var clsMsg = "msg " + clsHighlight + m.cls;
                    var lastMsg = i > 0 && msgs[i - 1];
                    var repeatingUser = lastMsg.userId === m.userId;
                    return (React.createElement("div", {key: msgId, id: msgId, className: clsMsg}, m.userId && !repeatingUser
                        ? React.createElement("b", {className: "user"}, React.createElement(User_1.User, {user: user || $.extend(m, { displayName: m.userName })}))
                        : React.createElement("b", null, " "), React.createElement("i", null, $.ss.tfmt12(m.time || new Date())), React.createElement("div", null, m.msg)));
                };
                ChatLog.prototype.render = function () {
                    return (React.createElement("div", {ref: "log", id: "log"}, this.props.messages.map(this.renderItem.bind(this))));
                };
                ChatLog = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        messages: state.messages.filter(function (m) { return !m.channel || m.channel === state.selectedChannel; }),
                        users: state.users,
                        activeSub: state.activeSub
                    }); })
                ], ChatLog);
                return ChatLog;
            }(React.Component));
            exports_1("ChatLog", ChatLog);
        }
    }
});
//# sourceMappingURL=ChatLog.js.map