System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var reducers, actionMiddleware;
    return {
        setters:[],
        execute: function() {
            exports_1("reducers", reducers = {
                CHANNELS_SELECT: function (state, action) { return Object.assign({}, state, { selectedChannel: action.channel }); },
                ERRORS_LOG: function (state, action) { return Object.assign({}, state, { errors: state.errors.concat([action.message]) }); },
                CONNECTED: function (state, action) { return Object.assign({}, state, { isConnected: true }); },
                MESSAGES_ADD: function (state, action) { return Object.assign({}, state, { messages: state.messages.concat(action.messages) }); },
                MESSAGES_SET: function (state, action) { return Object.assign({}, state, { messages: action.messages }); },
                USERS_REFRESH: function (state, action) { return Object.assign({}, state, { requiresUserRefresh: true }); },
                USERS_SET: function (state, action) { return Object.assign({}, state, { channelUsers: action.channelUsers, users: action.users, requiresUserRefresh: false }); },
                ACTIVESUB_SET: function (state, action) { return Object.assign({}, state, { activeSub: action.activeSub }); },
                TV_WATCH: function (state, action) { return Object.assign({}, state, { tvUrl: action.url }); },
                ANNOUNCE: function (state, action) { return Object.assign({}, state, { announce: action.announce }); },
                ERRORS_SHOW: function (state, action) { return Object.assign({}, state, { announceError: action.message }); },
                MESSAGEHISTORY_ADD: function (state, action) { return Object.assign({}, state, { msgHistory: state.msgHistory.concat([action.message]) }); },
                MESSAGEHISTORY_INDEX: function (state, action) { return Object.assign({}, state, { historyIndex: action.index }); },
                VALUE_SET: function (state, action) { return Object.assign({}, state, { value: action.value }); },
                USERS_SELECT: function (state, action) { return Object.assign({}, state, { selectedUser: action.user }); },
                EXAMPLES_TOGGLE: function (state, action) { return Object.assign({}, state, { hideExamples: !state.hideExamples }); }
            });
            exports_1("actionMiddleware", actionMiddleware = function (store) { return function (next) { return function (action) {
                console.log('action', action);
                var result = next(action);
                var state = store.getState();
                if (state.requiresUserRefresh) {
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
                return result;
            }; }; });
        }
    }
});
//# sourceMappingURL=reducers.js.map