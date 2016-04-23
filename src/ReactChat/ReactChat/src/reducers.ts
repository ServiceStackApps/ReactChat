export const reducers = {
    CHANNELS_SELECT: (state, action) => Object.assign({}, state, { selectedChannel: action.channel }),
    ERRORS_LOG: (state, action) => Object.assign({}, state, { errors: [...state.errors, action.message] }),
    CONNECTED: (state, action) => Object.assign({}, state, { isConnected:true }),
    MESSAGES_ADD: (state, action) => Object.assign({}, state, { messages: [...state.messages, ...action.messages] }),
    MESSAGES_SET: (state, action) => Object.assign({}, state, { messages: action.messages }),
    USERS_REFRESH: (state, action) => Object.assign({}, state, { requiresUserRefresh: true }),
    USERS_SET: (state, action) => Object.assign({}, state, { channelUsers: action.channelUsers, users: action.users, requiresUserRefresh:false }),
    ACTIVESUB_SET: (state, action) => Object.assign({}, state, { activeSub: action.activeSub }),
    TV_WATCH: (state, action) => Object.assign({}, state, { tvUrl: action.url }),
    ANNOUNCE: (state, action) => Object.assign({}, state, { announce: action.announce }),
    ERRORS_SHOW: (state, action) => Object.assign({}, state, { announceError: action.message }),
    MESSAGEHISTORY_ADD: (state, action) => Object.assign({}, state, { msgHistory: [...state.msgHistory, action.message ]}),
    MESSAGEHISTORY_INDEX: (state, action) => Object.assign({}, state, { historyIndex: action.index }),
    VALUE_SET: (state, action) => Object.assign({}, state, { value:action.value }),
    USERS_SELECT: (state, action) => Object.assign({}, state, { selectedUser: action.user }),
    EXAMPLES_TOGGLE: (state, action) => Object.assign({}, state, { hideExamples: !state.hideExamples })
};

export const actionMiddleware = store => next => action => {
    console.log('action', action);
    var result = next(action);

    var state = store.getState();
    if (state.requiresUserRefresh) {
        $.getJSON(state.channelSubscribersUrl, results => {
            var channelUsers = {};
            var usersMap = {};
            results.forEach(user => usersMap[user.userId] = user);
            Object.keys(usersMap).forEach((userId: any) => {
                const user = usersMap[userId];
                user.channels.split(',').map(channel => {
                    var users = (channelUsers[channel] || (channelUsers[channel] = []));
                    users.push(user);
                });
            });

            store.dispatch({ type: 'USERS_SET', channelUsers, users: channelUsers[state.selectedChannel] });
        });
    }

    return result;
};