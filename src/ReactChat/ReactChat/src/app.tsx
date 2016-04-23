// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path='../typings/browser.d.ts'/>

import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatLog } from './ChatLog';
import { Footer } from './Footer';
import { reducers, actionMiddleware } from './reducers';

import { reduxify } from './utils';
import 'ss-utils';

declare var EventSource: ssutils.IEventSourceStatic;

export interface IAppData {
    channels: string[];
    selectedChannel: string;
    isAuthenticated: boolean;
    eventStreamUrl: string;
    channelSubscribersUrl: string;
    chatHistoryUrl: string;
}

var AppData = window["AppData"] as IAppData;

var defaults = {
    channels: [],
    selectedChannel: AppData.selectedChannel,
    isAuthenticated: AppData.isAuthenticated,
    eventStreamUrl: AppData.eventStreamUrl,
    chatHistoryUrl: AppData.chatHistoryUrl,
    channelSubscribersUrl: AppData.channelSubscribersUrl,
    isConnected: false,
    anonMsgId: -1,
    messages: [],
    channelUsers:{},
    users: [],
    selectedUser: null,
    requiresUserRefresh: false,
    activeSub: null,
    errors: [],
    announce: null,
    tvUrl: null,
    hideExamples: false,
    value: "",
    historyIndex: -1,
    msgHistory: []
}

let store = createStore(
    (state, action) => {
        var reducer = reducers[action.type];
        var nextState = reducer != null
            ? reducer(state, action)
            : state;

        return nextState;
    }, 
    defaults,
    applyMiddleware(actionMiddleware)
);

@reduxify(
    (state) => ({
        channels: state.channels, 
        selectedChannel: state.selectedChannel,
        eventStreamUrl: state.eventStreamUrl,
        chatHistoryUrl: state.chatHistoryUrl,
        announce: state.announce,
        tvUrl: state.tvUrl
    }),
    (dispatch) => ({
        selectChannel: (channel:string) => dispatch({ type: 'CHANNELS_SELECT', channel }),
        logError: (message:string) => dispatch({ type: 'ERRORS_LOG', message }),
        didConnect: () => dispatch({ type: 'CONNECTED' }),
        addMessages: (messages:string[]) => dispatch({ type: 'MESSAGES_ADD', messages }),
        setMessages: (messages:string[]) => dispatch({ type: 'MESSAGES_SET', messages }),
        refreshUsers: () => dispatch({ type: 'USERS_REFRESH' }),
        setActiveSub: (activeSub:any) => dispatch({ type: 'ACTIVESUB_SET', activeSub }),
        watchUrl: (url:string) => dispatch({ type: 'TV_WATCH', url }),
        makeAnnouncement: (message:string) => dispatch({ type:'ANNOUNCE', message})
    })
)
class App extends React.Component<any, any> {

    constructor(props, context) {
         super(props, context);
    }

    id:string;
    source: ssutils.IEventSourceStatic;

    get templates() {
        return {
            youtube(id) {
                var url = `//www.youtube.com/embed/${id}?autoplay=1`;
                return (
                    <iframe width="640" height="360" src={url} frameBorder="0" allowFullScreen></iframe>
                );
            },
            generic(url) {
                return (
                    <iframe width="640" height="360" src={url} frameBorder="0"></iframe>
                );
            }
        };
    }

    componentDidMount() {
        this.props.selectChannel(this.props.selectedChannel);
        this.source = new EventSource(this.props.eventStreamUrl); //disable cache
        this.source.onerror = e => {
            this.props.logError(e);
        };
        $.ss.eventReceivers = { "document": document };
        $(this.source).handleServerEvents({
            handlers: {
                onConnect: (u) => {
                    console.log('onConnect', u);
                    this.props.setActiveSub(u);

                    this.props.didConnect();

                    $.getJSON(this.props.chatHistoryUrl, r => {
                        this.props.addMessages(r.results);
                    });

                    this.props.refreshUsers();
                },
                onReconnect() {
                    console.log("onReconnect", { newEventSource: this, errorArgs: arguments });
                },
                onJoin: this.props.refreshUsers,
                onLeave: this.props.refreshUsers,
                chat(msg, e) {
                    msg.channel = e.channel;
                    this.props.addMessages([msg]);
                }
            },
            receivers: {
                tv: {
                    watch: this.tvOn,
                    off: this.tvOff
                }
            }
        });
    }

    onMessagesUpdate (messages) {
        this.props.setMessages(messages).then(() => {
            var chatLog = this.refs["chatLog"] as any;
            if (!chatLog) return;
            $(chatLog.refs.log).scrollTop(1E10);
        });
    }

    showError(errorMsg) {
        this.props.makeAnnouncement(errorMsg);
    }

    announce(msg) {
        var $el = $(this.refs["announce"]);

        this.props.makeAnnouncement(msg)
            .then(() => {
                $el.fadeIn('fast');
            });

        setTimeout(() => {
            $el.fadeOut('slow');
            this.props.makeAnnouncement("");
        }, 2000);
    }

    tvOn(id) {
        if (id.indexOf('youtube.com') >= 0) {
            var qs = $.ss.queryString(id);
            this.props.watchUrl(this.templates.youtube(qs["v"]));
        }
        else if (id.indexOf('youtu.be') >= 0) {
            var v = $.ss.splitOnLast(id, '/')[1];
            this.props.watchUrl(this.templates.youtube(v));
        } else {
            this.props.watchUrl(this.templates.generic(id));
        }
    }

    tvOff() {
        this.props.watchUrl(null);
    }

    //onChannelChanged(channels) {
    //    this.setState({ channels: channels }, () => {
    //        (this.refs["footer"] as any).refs["txtMsg"].focus();
    //    });
    //}

    render() {
        if (this.props.channels == null) return null;
        var showTv = this.props.tvUrl ? 'block' : 'none';
        return (
            <div>
                <Header />

                <div ref="announce" id="announce">{this.props.announce}</div>
                <div ref="tv" id="tv" style={{ display: showTv }}>{this.props.tvUrl}</div>
                <Sidebar />

                <ChatLog ref="chatLog" />

                <Footer ref="footer" />
            </div>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);

