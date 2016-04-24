export const reducers = {
    CHANNELS_SELECT: (state, action) => Object.assign({}, state, { selectedChannel: action.channel }),
    ERRORS_LOG: (state, action) => Object.assign({}, state, { errors: [...state.errors, action.message] }),
    CONNECTED: (state, action) => Object.assign({}, state, { isConnected:true }),
    MESSAGES_ADD: (state, action) => Object.assign({}, state, { messages: [...state.messages, ...convertMsgs(action.messages, anonId(state.messages))] }),
    MESSAGES_SET: (state, action) => Object.assign({}, state, { messages: convertMsgs(action.messages, anonId(state.messages)) }),
    MESSAGES_CLEAR: (state, action) => Object.assign({}, state, { messages: [] }),
    USERS_SET: (state, action) => Object.assign({}, state, { channelUsers: action.channelUsers, users: action.users }),
    ACTIVESUB_SET: (state, action) => Object.assign({}, state, { activeSub: action.activeSub }),
    TV_WATCH: (state, action) => Object.assign({}, state, { tvUrl: action.url }),
    ANNOUNCE: (state, action) => Object.assign({}, state, { announce: action.message }),
    ERRORS_SHOW: (state, action) => Object.assign({}, state, { announceError: action.message }),
    MESSAGEHISTORY_ADD: (state, action) => state.msgHistory[state.msgHistory.length - 1] !== action.message
        ? Object.assign({}, state, { msgHistory: [...state.msgHistory, action.message] })
        : state,
    MESSAGEHISTORY_INDEX: (state, action) => Object.assign({}, state, { historyIndex: action.index }),
    VALUE_SET: (state, action) => Object.assign({}, state, { value:action.value }),
    EXAMPLES_TOGGLE: (state, action) => Object.assign({}, state, { hideExamples: !state.hideExamples })
};

const log = (o) => {
    console.log(o);
    return o;
}

const anonId = (msgs) => msgs.filter(m => m.id != null).map(m => m.id).sort((a, b) => a - b)[0] || -1;

const convertMsgs = (msgs, anonMsgId) => msgs.map(m => ({
    id: m.id || --anonMsgId,
    channel: m.channel,
    userId: m.fromUserId,
    userName: m.fromName,
    msg: m.message,
    cls: m.cls || (m.private ? ' private' : ''),
    time: new Date()
}));

export const actionMiddleware = store => next => action => {
//    console.log('action', action);
    var result = next(action);

    var fn = actions[action.type];
    if (fn != null) {
        fn(store, action);
    }

    return result;
};

export const actions = {
    USERS_REFRESH: (store, action) => {
        var state = store.getState();
        $.getJSON(state.channelSubscribersUrl, results => {
            var channelUsers = {};
            var usersMap = {};
            results.forEach(user => usersMap[user.userId] = user);
            Object.keys(usersMap).forEach((userId) => {
                const user = usersMap[userId];
                user.channels.split(',').map(channel => {
                    var users = (channelUsers[channel] || (channelUsers[channel] = []));
                    users.push(user);
                });
            });

            store.dispatch({ type: 'USERS_SET', channelUsers, users: channelUsers[state.selectedChannel] });
        });
    }
}
