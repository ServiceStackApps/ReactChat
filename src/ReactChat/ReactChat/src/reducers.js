System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var reducers, log, anonId, convertMsgs, actionMiddleware, actions;
    return {
        setters:[],
        execute: function() {
            exports_1("reducers", reducers = {
                CHANNELS_SELECT: function (state, action) { return Object.assign({}, state, { selectedChannel: action.channel }); },
                CONNECTED: function (state, action) { return Object.assign({}, state, { isConnected: true }); },
                AUTH: function (state, action) { return Object.assign({}, state, { isAuthenticated: action.isAuthenticated }); },
                MESSAGES_ADD: function (state, action) { return Object.assign({}, state, {
                    messages: state.messages.concat(convertMsgs(action.messages, anonId(state.messages)))
                }); },
                MESSAGES_SET: function (state, action) { return Object.assign({}, state, {
                    messages: convertMsgs(action.messages, anonId(state.messages))
                }); },
                MESSAGES_CLEAR: function (state, action) { return Object.assign({}, state, { messages: [] }); },
                USERS_SET: function (state, action) { return Object.assign({}, state, {
                    channelUsers: action.channelUsers, users: action.users
                }); },
                ACTIVESUB_SET: function (state, action) { return Object.assign({}, state, { activeSub: action.activeSub }); },
                TV_WATCH: function (state, action) { return Object.assign({}, state, { tvUrl: action.url }); },
                ANNOUNCE: function (state, action) { return Object.assign({}, state, { announce: action.message }); },
                ERRORS_SHOW: function (state, action) { return Object.assign({}, state, {
                    errors: state.errors.concat([action.message]),
                    messages: state.messages.concat(convertMsgs([{ message: action.message, cls: "error" }], anonId(state.messages)))
                }); },
                MESSAGEHISTORY_ADD: function (state, action) { return state.msgHistory[state.msgHistory.length - 1] !== action.message
                    ? Object.assign({}, state, { msgHistory: state.msgHistory.concat([action.message]) })
                    : state; },
                MESSAGEHISTORY_INDEX: function (state, action) { return Object.assign({}, state, { historyIndex: action.index }); },
                VALUE_SET: function (state, action) { return Object.assign({}, state, { value: action.value }); },
                EXAMPLES_TOGGLE: function (state, action) { return Object.assign({}, state, { hideExamples: !state.hideExamples }); }
            });
            log = function (o) {
                console.log(o);
                return o;
            };
            anonId = function (msgs) { return msgs.filter(function (m) { return m.id != null; }).map(function (m) { return m.id; }).sort(function (a, b) { return a - b; })[0] || -1; };
            convertMsgs = function (msgs, anonMsgId) { return msgs.map(function (m) { return ({
                id: m.id || --anonMsgId,
                channel: m.channel,
                userId: m.fromUserId,
                userName: m.fromName,
                msg: m.message,
                cls: m.cls || (m.private ? ' private' : ''),
                time: new Date()
            }); }); };
            exports_1("actionMiddleware", actionMiddleware = function (store) { return function (next) { return function (action) {
                //    console.log('action', action);
                var result = next(action);
                var fn = actions[action.type];
                if (fn != null) {
                    fn(store, action);
                }
                return result;
            }; }; });
            exports_1("actions", actions = {
                USERS_REFRESH: function (store, action) {
                    var state = store.getState();
                    $.getJSON(state.channelSubscribersUrl, function (results) {
                        var channelUsers = {};
                        var usersMap = {};
                        results.forEach(function (user) { return usersMap[user.userId] = user; });
                        Object.keys(usersMap).forEach(function (userId) {
                            var user = usersMap[userId];
                            user.channels.split(',').map(function (channel) {
                                var users = (channelUsers[channel] || (channelUsers[channel] = []));
                                users.push(user);
                            });
                        });
                        store.dispatch({ type: 'USERS_SET', channelUsers: channelUsers, users: channelUsers[state.selectedChannel] });
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=reducers.js.map