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
    var Footer;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            Footer = (function (_super) {
                __extends(Footer, _super);
                function Footer() {
                    _super.apply(this, arguments);
                }
                //mixins:[ 
                //    Reflux.listenTo(Actions.userSelected,"userSelected"), 
                //    Reflux.listenTo(Actions.setText,"setText")
                //],
                Footer.prototype.componentDidMount = function () {
                    this.txtMsg.focus();
                };
                Object.defineProperty(Footer.prototype, "txtMsg", {
                    get: function () {
                        return this.refs["txtMsg"];
                    },
                    enumerable: true,
                    configurable: true
                });
                Footer.prototype.postMsg = function () {
                    var _this = this;
                    var msg = this.txtMsg.value, parts, to = null, activeSub = this.props.activeSub;
                    if (msg) {
                        this.props.addMessageHistory(msg);
                    }
                    if (msg[0] === "@") {
                        parts = $.ss.splitOnFirst(msg, " ");
                        var toName = parts[0].substring(1);
                        if (toName === "me") {
                            to = activeSub.userId;
                        }
                        else {
                            var toUser = this.props.users.filter(function (user) { return user.displayName === toName.toLowerCase(); })[0];
                            to = toUser ? toUser.userId : null;
                        }
                        msg = parts[1];
                    }
                    if (!msg || !activeSub)
                        return;
                    var onError = function (e) {
                        if (e.responseJSON && e.responseJSON.responseStatus)
                            _this.props.showError(e.responseJSON.responseStatus.message);
                    };
                    if (msg[0] === "/") {
                        parts = $.ss.splitOnFirst(msg, " ");
                        $.post("/channels/" + this.props.selectedChannel + "/raw", {
                            from: activeSub.id,
                            toUserId: to,
                            message: parts[1],
                            selector: parts[0].substring(1)
                        }, function () { }).fail(onError);
                    }
                    else {
                        $.post("/channels/" + this.props.selectedChannel + "/chat", {
                            from: activeSub.id,
                            toUserId: to,
                            message: msg,
                            selector: "cmd.chat"
                        }, function () { }).fail(onError);
                    }
                    this.props.setValue("");
                };
                Footer.prototype.userSelected = function (user) {
                    this.setText("@" + user.displayName + " ");
                };
                Footer.prototype.setText = function (txt) {
                    var _this = this;
                    this.props.setValue(txt).then(function () {
                        _this.txtMsg.focus();
                    });
                };
                Footer.prototype.handleChange = function (e) {
                    this.props.setValue(e.target.value);
                };
                Footer.prototype.handleKeyDown = function (e) {
                    var _this = this;
                    var keycode = e.keyCode;
                    var value = this.props.value;
                    if ($.ss.getSelection()) {
                        if (keycode === "9" || keycode === "13" || keycode === "32" || keycode === "39") {
                            value += " ";
                            this.props.setValue(value).then(function () {
                                if (_this.txtMsg.setSelectionRange)
                                    _this.txtMsg.setSelectionRange(value.length, value.length);
                            });
                            e.preventDefault();
                            return;
                        }
                    }
                    var msgHistory = this.props.msgHistory;
                    if (keycode === "13") {
                        this.props.setHistoryIndex(-1);
                        this.postMsg();
                    }
                    else if (keycode === "38") {
                        this.props.setHistoryIndex(Math.min(++this.props.historyIndex, msgHistory.length));
                        this.props.setValue(this.props.msgHistory[msgHistory.length - 1 - this.props.historyIndex]);
                        e.preventDefault();
                    }
                    else if (keycode === "40") {
                        this.props.setHistoryIndex(Math.max(--this.props.historyIndex, -1));
                        this.props.setValue(msgHistory[msgHistory.length - 1 - this.props.historyIndex]);
                    }
                    else {
                        this.props.setHistoryIndex(-1);
                    }
                };
                Footer.prototype.handleKeyUp = function (e) {
                    var _this = this;
                    var value = this.props.value, activeSub = this.props.activeSub;
                    if (!$.ss.getSelection() && value[0] === "@" && value.indexOf(" ") < 0) {
                        var partialVal = value.substring(1);
                        var matchingNames = this.props.users
                            .map(function (x) { return x.displayName.replace(" ", ""); })
                            .filter(function (x) { return (x.substring(0, partialVal.length).toLowerCase() === partialVal.toLowerCase()
                            && x.toLowerCase() !== activeSub.displayName.toLowerCase()); });
                        if (matchingNames.length > 0) {
                            value += matchingNames[0].substring(partialVal.length);
                            this.props.setValue(value).then(function () {
                                if (_this.txtMsg.setSelectionRange)
                                    _this.txtMsg.setSelectionRange(partialVal.length + 1, value.length);
                            });
                        }
                    }
                };
                Footer.prototype.render = function () {
                    return (React.createElement("div", {id: "bottom"}, React.createElement("input", {ref: "txtMsg", id: "txtMsg", type: "text", value: this.props.value, onChange: this.handleChange, onKeyDown: this.handleKeyDown, onKeyUp: this.handleKeyUp}), React.createElement("button", {id: "btnSend", style: { marginLeft: 5 }, onClick: this.postMsg}, "Send")));
                };
                Footer = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        selectedChannel: state.selectedChannel,
                        users: state.users,
                        activeSub: state.activeSub,
                        value: state.value,
                        historyIndex: state.historyIndex,
                        msgHistory: state.msgHistory,
                    }); }, function (dispatch) { return ({
                        showError: function (message) { return dispatch({ type: 'ERRORS_SHOW', message: message }); },
                        addMessageHistory: function (message) { return dispatch({ type: 'MESSAGEHISTORY_ADD', message: message }); },
                        setHistoryIndex: function (index) { return dispatch({ type: 'MESSAGEHISTORY_INDEX', index: index }); },
                        setValue: function (value) { return dispatch({ type: 'VALUE_SET', value: value }); }
                    }); })
                ], Footer);
                return Footer;
            }(React.Component));
            exports_1("Footer", Footer);
        }
    }
});
//# sourceMappingURL=Footer.js.map