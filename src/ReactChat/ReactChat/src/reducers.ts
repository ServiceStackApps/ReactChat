export const reducers = {
    CHANNELS_SELECT: (state, action) => Object.assign({}, state, { selectedChannel: action.channel }),

    CONNECTED: (state, action) => Object.assign({}, state, { isConnected: true }),

    AUTH: (state, action) => Object.assign({}, state, { isAuthenticated: action.isAuthenticated }),

    MESSAGES_ADD: (state, action) => Object.assign({}, state, {
         messages: [...state.messages, ...convertMsgs(action.messages, anonId(state.messages))]
    }),

    MESSAGES_SET: (state, action) => Object.assign({}, state, {
         messages: convertMsgs(action.messages, anonId(state.messages))
    }),

    MESSAGES_CLEAR: (state, action) => Object.assign({}, state, { messages: [] }),

    USERS_SET: (state, action) => Object.assign({}, state, {
         channelUsers: action.channelUsers, users: action.users
    }),

    ACTIVESUB_SET: (state, action) => Object.assign({}, state, { activeSub: action.activeSub }),

    TV_WATCH: (state, action) => Object.assign({}, state, { tvUrl: action.url }),

    ANNOUNCE: (state, action) => Object.assign({}, state, { announce: action.message }),

    ERRORS_SHOW: (state, action) => Object.assign({}, state, {
        errors: [...state.errors, action.message],
        messages: [...state.messages, ...convertMsgs([{
            message: action.message, cls: "error"
        }], anonId(state.messages))]
    }),

    MESSAGEHISTORY_ADD: (state, action) => state.msgHistory[state.msgHistory.length-1] !== action.message
        ? Object.assign({}, state, { msgHistory: [...state.msgHistory, action.message] })
        : state,

    MESSAGEHISTORY_INDEX: (state, action) => Object.assign({}, state, { historyIndex: action.index }),

    VALUE_SET: (state, action) => Object.assign({}, state, { value: action.value }),

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
    },

    MESSAGES_POST: (store, action) => {
        var msg = action.message,
            state = store.getState(),
            parts,
            to = null,
            activeSub = state.activeSub;

        if (msg) {
            store.dispatch({ type: 'MESSAGEHISTORY_ADD', message: msg });
        }

        if (msg[0] === "@") {
            parts = $.ss.splitOnFirst(msg, " ");
            var toName = parts[0].substring(1);
            if (toName === "me") {
                to = activeSub.userId;
            } else {
                const toUser = state.users.filter(user => user.displayName === toName.toLowerCase())[0];
                to = toUser ? toUser.userId : null;
            }
            msg = parts[1];
        }
        if (!msg || !activeSub) return;
        const onError = e => {
            if (e.responseJSON && e.responseJSON.responseStatus)
                store.dispatch({ type: 'ERRORS_SHOW', message: e.responseJSON.responseStatus.message });
        };
        if (msg[0] === "/") {
            parts = $.ss.splitOnFirst(msg, " ");
            $.post(`/channels/${state.selectedChannel}/raw`, {
                from: activeSub.id,
                toUserId: to,
                message: parts[1],
                selector: parts[0].substring(1)
            },
                () => { }
            ).fail(onError);
        } else {
            $.post(`/channels/${state.selectedChannel}/chat`, {
                from: activeSub.id,
                toUserId: to,
                message: msg,
                selector: "cmd.chat"
            },
                () => { }
            ).fail(onError);
        }

        store.dispatch({ type: 'VALUE_SET', value: '' });
    }
}
