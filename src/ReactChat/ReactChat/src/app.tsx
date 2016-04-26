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

var channelStr = $.ss.queryString(location.href)["channels"] || "home";
var channels = channelStr.split(",");

var defaults = {
    actions: [],
    channels: channels,
    selectedChannel: channels[channels.length - 1],
    eventStreamUrl: `/event-stream?channels=${channelStr}&t=${new Date().getTime()}`,
    channelSubscribersUrl: `/event-subscribers?channels=${channelStr}`,
    chatHistoryUrl: `/chathistory?channels=${channelStr}`,
    isConnected: false,
    isAuthenticated: false,
    messages: [],
    channelUsers:{},
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
        didConnect: () => dispatch({ type: 'CONNECTED' }),
        setAuthenticated: (isAuthenticated) => dispatch({ type: 'AUTH', isAuthenticated }),
        addMessages: (messages:string[]) => dispatch({ type: 'MESSAGES_ADD', messages }),
        setMessages: (messages:string[]) => dispatch({ type: 'MESSAGES_SET', messages }),
        refreshUsers: () => dispatch({ type: 'USERS_REFRESH' }),
        setActiveSub: (activeSub:any) => dispatch({ type: 'ACTIVESUB_SET', activeSub }),
        watchUrl: (url:string) => dispatch({ type: 'TV_WATCH', url }),
        makeAnnouncement: (message:string) => dispatch({ type:'ANNOUNCE', message}),
        setValue: (value: string) => dispatch({ type: 'VALUE_SET', value })
    })
)
class App extends React.Component<any, any> {

    constructor(props, context) {
         super(props, context);
    }

    id:string;
    source: ssutils.IEventSourceStatic;

    footer: any;
    banner: HTMLElement;

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

    addMessages(msgs) {
        this.props.addMessages(msgs);
        $("#log").scrollTop(1E10);
    }

    componentDidMount() {
        this.props.selectChannel(this.props.selectedChannel);
        this.source = new EventSource(this.props.eventStreamUrl); //disable cache
        this.source.onerror = e => {
            this.props.addMessages([{ message: "ERROR!", cls: "error" }]);
        };
        $.ss.eventReceivers = { "document": document };
        $(this.source).handleServerEvents({
            handlers: {
                onConnect: (u) => {
                    this.props.setActiveSub(u);

                    this.props.didConnect();
                    this.addMessages([{ message: "CONNECTED!", cls: "open" }]);

                    $.getJSON(this.props.chatHistoryUrl, r => {
                        this.addMessages(r.results);
                    });

                    this.props.refreshUsers();
                },
                onReconnect() {
                    console.log("onReconnect", { errorArgs: arguments });
                },
                onJoin: this.props.refreshUsers,
                onLeave: this.props.refreshUsers,
                chat: (msg, e) => {
                    msg.channel = e.channel;
                    this.addMessages([msg]);
                },
                toggle() {
                    $(this).toggle();
                },
                announce: (msg) => {
                    var $el = $(this.banner);

                    this.props.makeAnnouncement(msg);
                    $el.fadeIn("fast");

                    setTimeout(() => {
                        $el.fadeOut("slow", () => {
                            this.props.makeAnnouncement("");
                        });
                    }, 2000);
                },
                removeReceiver(name) {
                    delete $.ss.eventReceivers[name];
                },
                addReceiver(name) {
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

        $(document).on("customEvent", (e, msg, msgEvent) => {
            this.addMessages([{ message: `[event ${e.type} message: ${msg}]`, cls: "event", channel: msgEvent.channel }]);
        });

        $.getJSON("auth", r => {
            this.props.setAuthenticated(true);
        }, e => {
            this.props.setAuthenticated(false);
        });
    }

    tvOn = (id) => {
        if (id.indexOf("youtube.com") >= 0) {
            var qs = $.ss.queryString(id);
            this.props.watchUrl(this.templates.youtube(qs["v"]));
        }
        else if (id.indexOf("youtu.be") >= 0) {
            var v = $.ss.splitOnLast(id, "/")[1];
            this.props.watchUrl(this.templates.youtube(v));
        } else {
            this.props.watchUrl(this.templates.generic(id));
        }
    }

    tvOff = () => {
        this.props.watchUrl(null);
    }

    onUserSelected = (user) => {
        this.props.setValue(`@${user.displayName} `);
        this.footer.getWrappedInstance().txtMsg.focus();
    }

    onCommandSelected = (cmd) => {
        this.props.setValue(cmd);
        this.footer.getWrappedInstance().txtMsg.focus();
    }

    onChannelelected = (channel) => {
        this.props.selectChannel(channel);
        this.footer.getWrappedInstance().txtMsg.focus();
    }

    render() {
        const showTv = this.props.tvUrl ? 'block' : 'none';
        return (
            <div>
                <Header onChannelelected={this.onChannelelected} />

                <div ref={x => this.banner = x} id="announce">{this.props.announce}</div>
                <div id="tv" style={{ display: showTv }}>{this.props.tvUrl}</div>
                <Sidebar onUserSelected={this.onUserSelected} onCommandSelected={this.onCommandSelected} />

                <ChatLog />

                <Footer ref={x => this.footer = x} />
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

