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
    var Footer, Keys;
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
                Footer.prototype.setText = function (txt) {
                    var _this = this;
                    this.props.setValue(txt).then(function () {
                        _this.txtMsg.focus();
                    });
                };
                Footer.prototype.postMsg = function () {
                    this.props.postMessage(this.txtMsg.value);
                };
                Footer.prototype.handleChange = function (e) {
                    this.props.setValue(e.target.value);
                };
                Footer.prototype.handleKeyDown = function (e) {
                    var _this = this;
                    var keycode = e.keyCode;
                    var value = this.props.value;
                    if ($.ss.getSelection()) {
                        if (keycode === Keys.tab ||
                            keycode === Keys.enter ||
                            keycode === Keys.space ||
                            keycode === Keys.right) {
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
                    var historyIndex = this.props.historyIndex;
                    if (keycode === Keys.enter) {
                        this.props.setHistoryIndex(-1);
                        this.postMsg();
                    }
                    else if (keycode === Keys.up) {
                        this.props.setHistoryIndex(Math.min(++historyIndex, msgHistory.length));
                        this.props.setValue(msgHistory[msgHistory.length - 1 - historyIndex] || "");
                        e.preventDefault();
                    }
                    else if (keycode === Keys.down) {
                        this.props.setHistoryIndex(Math.max(--historyIndex, -1));
                        this.props.setValue(msgHistory[msgHistory.length - 1 - historyIndex] || "");
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
                    var _this = this;
                    return (React.createElement("div", {id: "bottom"}, React.createElement("input", {ref: "txtMsg", id: "txtMsg", type: "text", value: this.props.value, onChange: function (e) { return _this.handleChange(e); }, onKeyDown: function (e) { return _this.handleKeyDown(e); }, onKeyUp: function (e) { return _this.handleKeyUp(e); }}), React.createElement("button", {id: "btnSend", style: { marginLeft: 5 }, onClick: this.postMsg}, "Send")));
                };
                Footer = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        users: state.users,
                        activeSub: state.activeSub,
                        value: state.value,
                        historyIndex: state.historyIndex,
                        msgHistory: state.msgHistory,
                    }); }, function (dispatch) { return ({
                        setHistoryIndex: function (index) { return dispatch({ type: 'MESSAGEHISTORY_INDEX', index: index }); },
                        setValue: function (value) { return dispatch({ type: 'VALUE_SET', value: value }); },
                        postMessage: function (message) { return dispatch({ type: 'MESSAGES_POST', message: message }); }
                    }); }, null, { withRef: true })
                ], Footer);
                return Footer;
            }(React.Component));
            exports_1("Footer", Footer);
            (function (Keys) {
                Keys[Keys["tab"] = 9] = "tab";
                Keys[Keys["enter"] = 13] = "enter";
                Keys[Keys["space"] = 32] = "space";
                Keys[Keys["left"] = 37] = "left";
                Keys[Keys["up"] = 38] = "up";
                Keys[Keys["right"] = 39] = "right";
                Keys[Keys["down"] = 40] = "down";
            })(Keys || (Keys = {}));
        }
    }
});
//# sourceMappingURL=Footer.js.map