// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path='../typings/browser.d.ts'/>
System.register(['react-dom', 'react', 'redux', 'react-redux', './Header', './Sidebar', './ChatLog', './Footer', './reducers', './utils', 'ss-utils'], function(exports_1, context_1) {
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
    var ReactDOM, React, redux_1, react_redux_1, Header_1, Sidebar_1, ChatLog_1, Footer_1, reducers_1, utils_1;
    var channelStr, channels, defaults, store, App;
    return {
        setters:[
            function (ReactDOM_1) {
                ReactDOM = ReactDOM_1;
            },
            function (React_1) {
                React = React_1;
            },
            function (redux_1_1) {
                redux_1 = redux_1_1;
            },
            function (react_redux_1_1) {
                react_redux_1 = react_redux_1_1;
            },
            function (Header_1_1) {
                Header_1 = Header_1_1;
            },
            function (Sidebar_1_1) {
                Sidebar_1 = Sidebar_1_1;
            },
            function (ChatLog_1_1) {
                ChatLog_1 = ChatLog_1_1;
            },
            function (Footer_1_1) {
                Footer_1 = Footer_1_1;
            },
            function (reducers_1_1) {
                reducers_1 = reducers_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (_1) {}],
        execute: function() {
            channelStr = $.ss.queryString(location.href)["channels"] || "home";
            channels = channelStr.split(",");
            defaults = {
                actions: [],
                channels: channels,
                selectedChannel: channels[channels.length - 1],
                eventStreamUrl: "/event-stream?channels=" + channelStr + "&t=" + new Date().getTime(),
                channelSubscribersUrl: "/event-subscribers?channels=" + channelStr,
                chatHistoryUrl: "/chathistory?channels=" + channelStr,
                isConnected: false,
                isAuthenticated: false,
                messages: [],
                channelUsers: {},
                users: [],
                selectedUser: null,
                activeSub: null,
                errors: [],
                announce: null,
                tvUrl: null,
                hideExamples: false,
                value: "",
                historyIndex: -1,
                msgHistory: []
            };
            store = redux_1.createStore(function (state, action) {
                var reducer = reducers_1.reducers[action.type];
                var nextState = reducer != null
                    ? reducer(state, action)
                    : state;
                return nextState;
            }, defaults, redux_1.applyMiddleware(reducers_1.actionMiddleware));
            App = (function (_super) {
                __extends(App, _super);
                function App(props, context) {
                    var _this = this;
                    _super.call(this, props, context);
                    this.tvOn = function (id) {
                        if (id.indexOf("youtube.com") >= 0) {
                            var qs = $.ss.queryString(id);
                            _this.props.watchUrl(_this.templates.youtube(qs["v"]));
                        }
                        else if (id.indexOf("youtu.be") >= 0) {
                            var v = $.ss.splitOnLast(id, "/")[1];
                            _this.props.watchUrl(_this.templates.youtube(v));
                        }
                        else {
                            _this.props.watchUrl(_this.templates.generic(id));
                        }
                    };
                    this.tvOff = function () {
                        _this.props.watchUrl(null);
                    };
                    this.onUserSelected = function (user) {
                        _this.props.setValue("@" + user.displayName + " ");
                        _this.footer.getWrappedInstance().txtMsg.focus();
                    };
                    this.onCommandSelected = function (cmd) {
                        _this.props.setValue(cmd);
                        _this.footer.getWrappedInstance().txtMsg.focus();
                    };
                    this.onChannelelected = function (channel) {
                        _this.props.selectChannel(channel);
                        _this.footer.getWrappedInstance().txtMsg.focus();
                    };
                }
                Object.defineProperty(App.prototype, "templates", {
                    get: function () {
                        return {
                            youtube: function (id) {
                                var url = "//www.youtube.com/embed/" + id + "?autoplay=1";
                                return (React.createElement("iframe", {width: "640", height: "360", src: url, frameBorder: "0", allowFullScreen: true}));
                            },
                            generic: function (url) {
                                return (React.createElement("iframe", {width: "640", height: "360", src: url, frameBorder: "0"}));
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                App.prototype.addMessages = function (msgs) {
                    this.props.addMessages(msgs);
                    $("#log").scrollTop(1E10);
                };
                App.prototype.componentDidMount = function () {
                    var _this = this;
                    this.props.selectChannel(this.props.selectedChannel);
                    this.source = new EventSource(this.props.eventStreamUrl); //disable cache
                    this.source.onerror = function (e) {
                        _this.props.addMessages([{ message: "ERROR!", cls: "error" }]);
                    };
                    $.ss.eventReceivers = { "document": document };
                    $(this.source).handleServerEvents({
                        handlers: {
                            onConnect: function (u) {
                                _this.props.setActiveSub(u);
                                _this.props.didConnect();
                                _this.addMessages([{ message: "CONNECTED!", cls: "open" }]);
                                $.getJSON(_this.props.chatHistoryUrl, function (r) {
                                    _this.addMessages(r.results);
                                });
                                _this.props.refreshUsers();
                            },
                            onReconnect: function () {
                                console.log("onReconnect", { errorArgs: arguments });
                            },
                            onJoin: this.props.refreshUsers,
                            onLeave: this.props.refreshUsers,
                            chat: function (msg, e) {
                                msg.channel = e.channel;
                                _this.addMessages([msg]);
                            },
                            toggle: function () {
                                $(this).toggle();
                            },
                            announce: function (msg) {
                                var $el = $(_this.banner);
                                _this.props.makeAnnouncement(msg);
                                $el.fadeIn("fast");
                                setTimeout(function () {
                                    $el.fadeOut("slow", function () {
                                        _this.props.makeAnnouncement("");
                                    });
                                }, 2000);
                            },
                            removeReceiver: function (name) {
                                delete $.ss.eventReceivers[name];
                            },
                            addReceiver: function (name) {
                                $.ss.eventReceivers[name] = window[name];
                            }
                        },
                        receivers: {
                            tv: {
                                watch: this.tvOn,
                                off: this.tvOff
                            }
                        }
                    });
                    $(document).on("customEvent", function (e, msg, msgEvent) {
                        _this.addMessages([{ message: "[event " + e.type + " message: " + msg + "]", cls: "event", channel: msgEvent.channel }]);
                    });
                    $.getJSON("auth", function (r) {
                        _this.props.setAuthenticated(true);
                    }, function (e) {
                        _this.props.setAuthenticated(false);
                    });
                };
                App.prototype.render = function () {
                    var _this = this;
                    if (this.props.channels == null)
                        return null;
                    var showTv = this.props.tvUrl ? 'block' : 'none';
                    return (React.createElement("div", null, React.createElement(Header_1.Header, {onChannelelected: this.onChannelelected}), React.createElement("div", {ref: function (x) { return _this.banner = x; }, id: "announce"}, this.props.announce), React.createElement("div", {ref: "tv", id: "tv", style: { display: showTv }}, this.props.tvUrl), React.createElement(Sidebar_1.Sidebar, {onUserSelected: this.onUserSelected, onCommandSelected: this.onCommandSelected}), React.createElement(ChatLog_1.ChatLog, {ref: "chatLog"}), React.createElement(Footer_1.Footer, {ref: function (x) { return _this.footer = x; }})));
                };
                App = __decorate([
                    utils_1.reduxify(function (state) { return ({
                        channels: state.channels,
                        selectedChannel: state.selectedChannel,
                        eventStreamUrl: state.eventStreamUrl,
                        chatHistoryUrl: state.chatHistoryUrl,
                        announce: state.announce,
                        tvUrl: state.tvUrl
                    }); }, function (dispatch) { return ({
                        selectChannel: function (channel) { return dispatch({ type: 'CHANNELS_SELECT', channel: channel }); },
                        didConnect: function () { return dispatch({ type: 'CONNECTED' }); },
                        setAuthenticated: function (isAuthenticated) { return dispatch({ type: 'AUTH', isAuthenticated: isAuthenticated }); },
                        addMessages: function (messages) { return dispatch({ type: 'MESSAGES_ADD', messages: messages }); },
                        setMessages: function (messages) { return dispatch({ type: 'MESSAGES_SET', messages: messages }); },
                        refreshUsers: function () { return dispatch({ type: 'USERS_REFRESH' }); },
                        setActiveSub: function (activeSub) { return dispatch({ type: 'ACTIVESUB_SET', activeSub: activeSub }); },
                        watchUrl: function (url) { return dispatch({ type: 'TV_WATCH', url: url }); },
                        makeAnnouncement: function (message) { return dispatch({ type: 'ANNOUNCE', message: message }); },
                        setValue: function (value) { return dispatch({ type: 'VALUE_SET', value: value }); }
                    }); })
                ], App);
                return App;
            }(React.Component));
            ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement(App, null)), document.getElementById("app"));
        }
    }
});
//# sourceMappingURL=app.js.map