# React Chat

React Chat is a port of [ServiceStack Chat](https://github.com/ServiceStackApps/Chat) ES5, jQuery Server Events 
demo into a [TypeScript](http://www.typescriptlang.org/), [React](http://facebook.github.io/react/) and 
[Redux](https://github.com/reactjs/redux) App:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/screenshot.png)

## React App VS.NET Template

React Chat was developed using 
[ServiceStackVS's](https://github.com/ServiceStack/ServiceStackVS) npm-based **React App** 
VS.NET SPA Template providing a productive integrated solution for building modern complex JavaScript 
Single Page Apps in VS.NET that includes the following best-of-class components:

  - [TypeScript](http://www.typescriptlang.org/) - Superset of JavaScript with optional typing, advanced language features and down-level ES5 support
  - [JSPM](http://jspm.io/) - JavaScript Package Manager supporting SystemJS modules and multiple npm and GitHub repositories 
  - [typings](https://github.com/typings/typings) - Package manager to search and install TypeScript definition files
  - [React](https://facebook.github.io/react/) - Simple, high-performance JavaScript UI Framework utilizing a Virtual DOM and Reactive Data flows

Whilst the pre-configured [Gulp](http://gulpjs.com/) scripts provides automation scripts for Client and Server
packaging, bundling, minifying and deployments via MS WebDeploy. 

## [TypeScript Redux](https://github.com/ServiceStackApps/typescript-redux)

React Chat also uses [Redux](https://github.com/reactjs/redux) - the most popular Flux-like library
for maintaining Application state in React Apps. If you're new to any of these technologies we recommend going 
through our in-depth [TypeScript, React + Redux step-by-step Guide](https://github.com/ServiceStackApps/typescript-redux)
which walks you through from building the simplest Hello World TypeScript React project to a more complex 
real-time networked Server Events App.

## Pre-requisites 

If you haven't installed it yet, you'll need [ServiceStackVS VS.NET extension](https://github.com/ServiceStack/ServiceStack/wiki/Creating-your-first-project#step-1-download-and-install-servicestackvs).
as well as [TypeScript for VS.NET](http://www.typescriptlang.org/#download-links).

## Getting Started

To create a Single Page React Apps with ServiceStack choose the **React App** VS.NET template:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/ssvs-proj-template.png)

This can take up to a few minutes to fetch all the javascript packages from npm. You can watch the **Output** 
window to view the progress: 

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-react-template/master/img/ServiceStackVS-npm-output.png)

Once completed, hit **F5** to run the App and see a working client/server Hello World React App:

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-react-template/master/img/default-app.png)

## Optimal Development and Deployment workflow

Fast dev iterations are one of the major productivity benefits when developing JavaScript Apps. By using
TypeScript we sacrifice a bit of the immediacy as we're no longer directly editing the JavaScript source files
the browsers end up running, but VS.NET's TypeScript support gets us pretty close as it will generate the 
corresponding `.js` each time we save its original TypeScript `.ts` source file.

A lot of the time the development experience with TypeScript is seamless as by the time we hit **Ctrl+S** 
to save our modified TypeScript source files and switch over to our browser the `.js` files are already 
generated when we reload our app. Although you'll want to keep an eye on the **Error List** VS.NET Tab 
for any TypeScript compiler errors as they'll indicate any remaining errors you'll need to fix in order for
TypeScript to generate the `.js` files.

This is the typical workflow during development where you'll mostly just be editing TypeScript `.ts` files 
under `src/` folder and switching to the browser to view your changes. You won't need to run any of the Gulp 
tasks during development as they're primarily for staging and packaging your App for production so it's 
ready for deployment.

## Installing additional libraries

Having an npm-based VS.NET Template gives us access to the largest repository of JavaScript libraries available.
For front-end dependencies we'll be using [JSPM](http://jspm.io/) to fetch all our additional JS packages for
us. 

The easiest way to use JSPM is via the console which you can do by holding down **Shift** whilst 
right-clicking the **ReactChat** Host project folder to open a new console at that directory:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/open-console.png)

With the console open, we can get jspm to fetch our dependencies for us. Chat just needs **redux**:

    c:\proj> jspm install redux
    
And Redux's bindings to React, **react-redux**:

    c:\proj> jspm install react-redux
    
The list of dependencies are maintained in jspm's `config.js` with the libraries themselves stored under 
`jspm_packages/` folder. 

Since we're using TypeScript we'll also need the ambient Type Definitions for both libraries:

    c:\proj> typings install redux --ambient --save

Same with react-redux:

    c:\proj> typings install react-redux --ambient --save

This will save the type definitions in the `typings/` folder. To reference the Type Definitions in all our
TypeScript sources we just need to add a doc ref to `typings/browser.d.ts` at the top of each of our source
files, e.g:

```csharp
/// <reference path='../typings/browser.d.ts'/>
```

### Updating deps.lib.js cache

It's recommended after installing new packages to modify `src/deps.tsx` to add reference to the new modules 
then rerun the **00-update-deps-js** Gulp task to generate a cache of the referenced dependencies in 
`deps.lib.js`. This will minimize the number of requests required to load the App in development and allow 
for faster developer iteration times.

## default.html

One of the benefits of using JSPM with TypeScript is that we no longer need to manually edit our `default.html`
each time we add a JavaScript dependency as JSPM takes care of loading all our JavaScript modules for us 
which it does by looking at the same `config.js` it uses to maintain the list of installed JS packages.

The gulp [useref](https://www.npmjs.com/package/gulp-useref) plugin allows us to markup our `default.html`
starting page with rules of how we want our development references rewritten for production:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <!--build:css css/app.min.css-->
    <link rel="stylesheet" href="css/app.css" />
    <!-- endbuild -->
    <title>ReactChat</title>
</head>
<body>
    <div class="container">
        <div id="app"></div>
    </div>
	    
	<!-- build:js system.js -->
    <script src="jspm_packages/system.js"></script>
    <!-- endbuild -->

    <script src="config.js"></script>

    <!-- build:remove -->
    <script src="deps.lib.js"></script>
    <!-- endbuild -->
	
    <!-- htmlbuild:appbundle -->
    <!-- endbuild -->
	
    <script>
        System.import("./src/app");
    </script>
</body>
</html>
```

In most cases we never need to modify the `default.html` page as during development you'll be spending most
of your time just writing TypeScript or adding styles to `css/app.cs` and for production running the 
**02-package-client** Gulp task takes care of:

 - minifying `css/app.css` to `css/app.min.css`
 - copying `jspm_packages/system.js` to `system.js`
 - removing the reference to the developer time only `deps.lib.js` cache
 - adding a reference to our compiled `app.js` bundle at `htmlbuild:appbundle`

The resulting output is then rewritten and stored in the staging `wwwroot/default.html` along with all our 
client / server resources and dependencies required to run the App.

## Gulp Tasks

The list of Gulp tasks include scripts for **updating cached dependencies** used during development as well
as scripts for **staging your App** under the self-contained `/wwwroot` folder and **deploying** it using WebDeploy:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/ssvs-gulp.png)

 - **00-update-deps-js** - Used to regenerate `deps.lib.js` from `deps.tsx` for reducing number of HTTP requests sent on each refresh
 - **01-package-server** - Used for building and staging the server components of your application
 - **02-package-client** - Used to compile and stage your client resources into `wwwroot/` ready for deployment
 - **03-deploy-app** - Deploys your application using msdeploy and `config.json` found in `wwwroot_build/publish/`

The **default** task runs **01-package-server** and **02-package-client** to build and stage your entire App.

Whilst **package-and-deploy** also runs **03-deploy-app** to deploy your staged application using MS WebDeploy
using settings from `wwwroot_build/publish/config.json`.

> You can double-click the task name in VS.NET's Task Runner Explorer UI to run that specified task

## Designing a React App

Now that we've explored the features and development workflow of the **React App** template we can start
developing our App.

The first step into creating a React app is deciding how to structure the app, as React Components are 
just lightweight classes the number of components shouldn't affect the granularity in partitioning 
your app so you can happily opt for the most logical separation that suits your App.

For Chat, this was easy as it was already visually separated by different regions, allowing it to be naturally partitioned into the following distinct logical components:

![Chat Components](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/chat-components.png)

- [Header.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Header.tsx)
- [ChatLog.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/ChatLog.tsx)
- [Sidebar.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Sidebar.tsx)
- [Footer.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Footer.tsx)

As well as a top-level `App` component used to compose the different components together:

- [app.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/app.tsx)

Instead of storing state isolated in different components we'll instead be storing all State in a single 
Redux store where all our reducers for maintaining each state transition in:

- [reducers.ts](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/reducers.ts)

To allow us to be able to declaratively specify the Redux state and actions we need we'll be using 
[annotations to connect Components](https://github.com/ServiceStackApps/typescript-redux#refactoring-redux-components)
to Redux. Normally we'd be able to reuse react-redux's `connect()` method as an annotation directly, however a 
recent change resulted in incompatible types now preventing this, the workaround is to create a custom 
`@reduxify()` wrapper that strips the Type definitions, e.g:

```typescript
export function reduxify(mapStateToProps, mapDispatchToProps?, mergeProps?, options?) {
    return target => (connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(target) as any);
}
```

Which is defined in:

- [utils.ts](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/utils.ts)

### High-level Structure

The first step in porting to React is getting the layout and structure of your App right, so for the first 
pass just the HTML markup was extracted into each Component, where the initial cut of 
[Footer.jsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Footer.tsx) 
before adding any behavior just looked like:

```js
export class Footer extends React.Component<any, any> {
    render() {
        return (
            <div id="bottom">
                <input ref="txtMsg" id="txtMsg" type="text" />
                <button id="btnSend" style={{ marginLeft: 5 }}>Send</button>
            </div>
        );
    }
}
```

React has nice support of this gradual design-first dev workflow where the visual appearance of your App 
remains viewable after each stage of extracting the just HTML markup into its separate Components. 

This lets us visually see the design of our App by just returning static markup in the different different JSX,
e.g. this is what our main `App` JSX component looks like without any logic:

```jsx
class App extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Header />

                <div id="announce"></div>
                <div id="tv" style={{ display: 'none' }}></div>
                <Sidebar  />

                <ChatLog />

                <Footer />
            </div>
        );
    }
}
```

Which is structurally equivalent to the completed port with the addition of custom logic.

## State and Communications between Components

The important concept to keep in mind when reasoning about React's design is that components are a projection 
for a given State. To enforce this, data flows unidirectionally down from the top-most Component (Owner) 
to its children via properties. 

As we're using Redux we're no longer maintaining state within different React components, instead the single 
Redux store keeps a snapshot of our entire App's state and we use the `@reduxify()` annotation to 
declaratively specify which state our Component needs access to and what state modifications it intends to 
make which are both merged with the properties of the Component and made available via properties.

Here the top-level `App` component uses the `@reduxify()` annotation to declare the properties it needs and 
the actions it dispatches:

```typescript
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
class App extends React.Component<any, any> { ... }
```

Adding a top-level React Redux `<Provider>` component is what makes this possible which takes care of 
injecting the Redux `store` into each of the React components annotated with `@reduxify()`:

```typescript
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
```

We create the Redux store using Redux's `createStore()` passing in the defaults of all the state maintained
in our App. We're also making use of 
[redux middleware to contain any side-effects](https://github.com/ServiceStackApps/typescript-redux/#using-middleware-for-side-effects) 
that are triggered by Redux store actions:

```typescript
import { createStore, applyMiddleware } from 'redux';
import { reducers, actionMiddleware } from './reducers';

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
```

In order to keep the code maintainable we're 
[maintaining all our App reducers](https://github.com/ServiceStackApps/typescript-redux/#refactoring-reducers) 
in an external library:

#### [reducers.ts](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/reducers.ts)

```typescript
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

    MESSAGEHISTORY_ADD: (state,action) => state.msgHistory[state.msgHistory.length-1] != action.message
        ? Object.assign({}, state, { msgHistory: [...state.msgHistory, action.message] })
        : state,

    MESSAGEHISTORY_INDEX: (state, action) => Object.assign({}, state, { historyIndex: action.index }),

    VALUE_SET: (state, action) => Object.assign({}, state, { value: action.value }),

    EXAMPLES_TOGGLE: (state, action) => Object.assign({}, state, { hideExamples: !state.hideExamples })
};
```

Which contains reducers for all changes to our App state which return an immutable copy of the next state
transition. 

We do the same for our Action middleware which maintains non-UI code that are also triggered by dispatching
a Redux Action. A nice property of Redux middleware is that we can see all the actions dispatched through
our App by uncommenting the line below:

```typescript
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
```

By maintaining non-UI side-effects that indirectly trigger state changes in middleware similar to how we're 
maintaining Reducers, we're leveraging the pub/sub and automatic state synchronization features in Redux in
order to communicate between components. Among other benefits this now lets any component trigger any 
action with a normal message dispatch from anywhere in our App:

```typescript
store.dispatch({ type: 'USERS_REFRESH' });

store.dispatch({ type: 'MESSAGES_POST', message:'Hello, World!' });
```

## Chat App Components

The Redux store is the conduit binding all App components together to the App state, the relationships 
of which are declared in the `@reduxify()` annotation which captures both the **inputs** and **outputs** 
each component needs - both are injected into the React Component via properties. 

With the structre in-place all that remains is to import all existing logic into their different 
React Components and wire them to use injected properties:

#### [app.tsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/app.tsx)

```typescript
declare var EventSource: ssutils.IEventSourceStatic;

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
```

#### [Header.tsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Header.tsx)

```typescript
@reduxify(
    (state) => ({
        channels: state.channels,
        selectedChannel: state.selectedChannel,
        isAuthenticated: state.isAuthenticated,
        activeSub: state.activeSub
    }),
    (dispatch) => ({
        clearMessages: () => dispatch({ type: 'MESSAGES_CLEAR' })
    })
)
export class Header extends React.Component<any, any> {
    openChannel() {
        const chan = prompt("Join another Channel?", "ChannelName");
        if (chan)
            location.href = `?channels=${[...this.props.channels, chan.replace(/\s+/g, "")].join(",")}`;
    }
    selectChannel(e) {
        this.props.onChannelelected(e.target.getAttribute("data-channel"));
    }

    render() {
        return (
            <div id="top">
                <a href="https://github.com/ServiceStackApps/LiveDemos">
                    <img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/img/artwork/logo-32-inverted.png"
                        style={{ height: "28px", padding: "10px 0 0 0" }} />
                </a>
                <div id="social">
                    <div id="welcome">
                        {this.props.activeSub
                            ? <span>
                                <span>Welcome, {this.props.activeSub.displayName}</span>
                                <img src={this.props.activeSub.profileUrl} />
                            </span>
                            : null}
                    </div>
                    {this.props.isAuthenticated
                        ? null
                        : <span>
                            <a href="/auth/twitter" className="twitter"></a>
                            <a href="/auth/facebook" className="facebook"></a>
                            <a href="/auth/github" className="github"></a>
                        </span>}
                </div>
                <ul id="channels" style={{ margin: "0 0 0 30px" }}>
                    {this.props.channels.map(channel => <li className={this.props.selectedChannel === channel ? "selected" : ""}
                        data-channel={channel}
                        onClick={this.selectChannel.bind(this)}>
                        {channel}
                    </li>) }
                    <li style={{ background: "none", padding: "0 0 0 5px" }}>
                        <button onClick={this.openChannel.bind(this)}>+</button>
                    </li>
                    <li style={{ background: "none", padding: 0 }}>
                        <span style={{ fontSize: 13, color: "#ccc", paddingLeft: 10 }} onClick={this.props.clearMessages}>clear</span>
                    </li>
                </ul>
            </div>
        );
    }
}
```

#### [Sidebar.tsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Sidebar.tsx)

```typescript
@reduxify(
    (state) => ({
        users: state.users,
        hideExamples: state.hideExamples
    }),
    (dispatch) => ({
        toggleExamples:() => dispatch({ type: 'EXAMPLES_TOGGLE' })
    })
)
export class Sidebar extends React.Component<any, any> {
    render() {
        const height = this.props.hideExamples ? "25px" : "auto";
        const label = this.props.hideExamples ? "show" : "hide";
        return (
            <div id="right">
                <div id="users">
                    {this.props.users.map(user => <User key={user.userId} user={user} onSelect={() => this.props.onUserSelected(user)} />)}
                </div>
                <div id="examples" style={{ height: height }}>
                    <span style={{position: "absolute", top: "2px", right: "7px"}} onClick={this.props.toggleExamples}>{label}</span>
                    <span onClick={e => this.props.onCommandSelected((e.target as HTMLElement).innerHTML)}>
                        <h4><a href="https://github.com/ServiceStackApps/Chat#global-event-handlers">Example Commands</a></h4>
                        <div>/cmd.announce This is your captain speaking ...</div>
                        <div>/cmd.toggle$#channels</div>
                        <h4><a href="https://github.com/ServiceStackApps/Chat#modifying-css-via-jquery">CSS</a></h4>
                        <div>/css.background-image url(http://bit.ly/1oQqhtm)</div>
                        <div>/css.background-image url(http://bit.ly/1yIJOBH)</div>
                        <div>@me /css.background #eceff1</div>
                        <div>/css.background$#top #673ab7</div>
                        <div>/css.background$#bottom #0091ea</div>
                        <div>/css.background$#right #fffde7</div>
                        <div>/css.color$#welcome #ff0</div>
                        <div>/css.visibility$img,a hidden</div>
                        <div>/css.visibility$img,a visible</div>
                        <h4><a href="https://github.com/ServiceStackApps/Chat#receivers">Receivers</a></h4>
                        <div>/tv.watch http://youtu.be/518XP8prwZo</div>
                        <div>/tv.watch https://servicestack.net/img/logo-220.png</div>
                        <div>@me /tv.off</div>
                        <div>/document.title New Window Title</div>
                        <div>/cmd.addReceiver window</div>
                        <div>/window.location http://google.com</div>
                        <div>/cmd.removeReceiver window</div>
                        <h4><a href="https://github.com/ServiceStackApps/Chat#jquery-events">Triggers</a></h4>
                        <div>/trigger.customEvent arg</div>
                    </span>
                </div>
            </div>
        );
    }
}
```

#### [ChatLog.tsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/ChatLog.tsx)

```typescript
@reduxify(
    (state) => ({
        messages: state.messages.filter(m => !m.channel || m.channel === state.selectedChannel),
        users: state.users,
        activeSub: state.activeSub
    })
)
export class ChatLog extends React.Component<any, any> {
    renderItem(m, i, msgs) {
        const user = this.props.users.filter(user => (user.userId === m.userId))[0];

        const clsHighlight = m.msg.indexOf(this.props.activeSub.displayName.replace(" ", "")) >= 0 
            ? "highlight " 
            : "";

        const msgId = `m_${m.id || "0"}`;
        const clsMsg = `msg ${clsHighlight}${m.cls}`;
        const lastMsg = i > 0 && msgs[i -1];
        const repeatingUser = lastMsg.userId === m.userId;

        return (
            <div key={msgId} id={msgId} className={clsMsg}>
                {m.userId && !repeatingUser 
                    ? <b className="user">
                        <User user={ user || $.extend(m, { displayName: m.userName }) } />
                      </b> 
                    : <b>&nbsp;</b>}
                <i>{ $.ss.tfmt12(m.time || new Date()) }</i>
                <div>{m.msg}</div>
            </div>
        );
    }

    render() {
        return (
            <div ref="log" id="log">
                {this.props.messages.map(this.renderItem.bind(this))}
            </div>
        );
    }
}
```

#### [Footer.tsx](https://github.com/ServiceStackApps/ReactChat/blob/master/src/ReactChat/ReactChat/src/Footer.tsx)

```typescript
@reduxify(
    (state) => ({
        users: state.users,
        activeSub: state.activeSub,
        value: state.value,
        historyIndex: state.historyIndex,
        msgHistory: state.msgHistory,
    }),
    (dispatch) => ({
        setHistoryIndex: (index: number) => dispatch({ type: 'MESSAGEHISTORY_INDEX', index }),
        setValue: (value: string) => dispatch({ type: 'VALUE_SET', value }),
        postMessage: (message: string) => dispatch({ type: 'MESSAGES_POST', message })
    }),
    null,
    { withRef: true }
)
export class Footer extends React.Component<any, any> {
    componentDidMount() {
        this.txtMsg.focus();
    }
    get txtMsg(): HTMLInputElement {
        return this.refs["txtMsg"] as HTMLInputElement;
    }
    setText(txt) {
        this.props.setValue(txt).then(() => {
            this.txtMsg.focus();
        });
    }
    postMsg() {
        this.props.postMessage(this.txtMsg.value);
    }
    handleChange(e) {
        this.props.setValue(e.target.value);
    }
    handleKeyDown(e) {
        const keycode = e.keyCode;
        var value = this.props.value;

        if ($.ss.getSelection()) {
            if (keycode === Keys.tab ||
                keycode === Keys.enter ||
                keycode === Keys.space ||
                keycode === Keys.right) {

                value += " ";
                this.props.setValue(value).then(() => {
                    if (this.txtMsg.setSelectionRange)
                        this.txtMsg.setSelectionRange(value.length, value.length);
                });
                    
                e.preventDefault();
                return;
            }
        }

        const msgHistory = this.props.msgHistory;
        var historyIndex = this.props.historyIndex;
        if (keycode === Keys.enter) {
            this.props.setHistoryIndex(-1);
            this.postMsg();
        } else if (keycode === Keys.up) {
            this.props.setHistoryIndex(Math.min(++historyIndex, msgHistory.length));
            this.props.setValue(msgHistory[msgHistory.length - 1 - historyIndex] || "");
            e.preventDefault();
        }
        else if (keycode === Keys.down) {
            this.props.setHistoryIndex(Math.max(--historyIndex, -1));
            this.props.setValue(msgHistory[msgHistory.length - 1 - historyIndex] || "");
        } else {
            this.props.setHistoryIndex(-1);
        }
    }
    handleKeyUp(e) {
        var value = this.props.value,
            activeSub = this.props.activeSub;

        if (!$.ss.getSelection() && value[0] === "@" && value.indexOf(" ") < 0) {
            var partialVal = value.substring(1);

            const matchingNames = this.props.users
                .map(x => x.displayName.replace(" ", ""))
                .filter(x => (x.substring(0, partialVal.length).toLowerCase() === partialVal.toLowerCase()
                    && x.toLowerCase() !== activeSub.displayName.toLowerCase()));

            if (matchingNames.length > 0) {
                value += matchingNames[0].substring(partialVal.length);

                this.props.setValue(value).then(() => {
                    if (this.txtMsg.setSelectionRange)
                        this.txtMsg.setSelectionRange(partialVal.length + 1, value.length);
                });
            }
        }
    }

    render() {
        return (
            <div id="bottom">
                <input ref="txtMsg" id="txtMsg"
                    type="text"
                    value={this.props.value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={e => this.handleKeyDown(e)}
                    onKeyUp={e => this.handleKeyUp(e)} />
                <button id="btnSend" style={{ marginLeft: 5 }} onClick={this.postMsg}>Send</button>
            </div>
        );
    }
}

enum Keys {
    tab = 9,
    enter = 13,
    space = 32,
    left = 37,
    up = 38,
    right = 39,
    down = 40,
}
```

## Packaging and Deployment

With the React Components above we now have a complete front-end Chat App, what's next is to package
our app for production by running the **default** Gulp task which copies all our project client and server 
resources into the `wwwroot/` staging folder: 

    wwwroot/
        bin/
        css/
          app.min.css
        img/
        app.js
        appsettings.txt
        config.js
        default.html
        Global.asax
        system.js
        web.config

The 
[wwwroot_build/deploy/](https://github.com/ServiceStackApps/ReactChat/tree/master/src/ReactChat/ReactChat/wwwroot_build/deploy) 
folder contains any additional files you want available for production which are also copied into the 
staging folder and what is used to copy the production `appsettings.txt` to override default `<appSettings/>`.

The result is a complete stand-alone ASP.NET Web Application that's ready for production deployment which 
we can deploy by populating `wwwroot_build/publish/config.json` with MS WebDeploy settings:

```json
{
    "iisApp": "ReactChat",
    "serverAddress": "react-chat.servicestack.net",
    "userName": "{WebDeployUserName}",
    "password" : "{WebDeployPassword}"
}
```

Then running the **03-deploy-app** Gulp task which creates a `webdeploy.zip` package of the staging `wwwroot/` 
folder and deploys it using MS WebDeploy to the remote `serverAddress` specified in the `config.json`.

When **03-deploy-app** completes you can open the remote address in your browser to see the latest changes!

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/chat-react/screenshot.png)](http://react-chat.servicestack.net/)

> Live Demo: http://react-chat.servicestack.net

The Gulp deploy task shows a quick way of updating your development server quickly after making changes to 
your application. For more information on use web-deploy using either Gulp or just Visual Studio publish, 
see [WebDeploy with AWS](https://github.com/ServiceStack/ServiceStack/wiki/Simple-Deployments-to-AWS-with-WebDeploy).

### .gitignore

Similar to how we ignore NuGet `packages/` folder in **.gitignore** to avoid checking them into our Git
repository, we'll want to do the same for npm, jspm and typing folders as well. We also don't need to
check in the staging `wwwroot/` folder or the `webdeploy.zip` MS WebDeploy package that our Gulp script 
generates for us, which we can all ignore by adding them to Git repositories **.gitignore**:

```
node_modules/
jspm_packages/
typings/
wwwroot/
webdeploy.zip
```

If you're using Github's default **VisualStudio** ignore template the `publish/` folder will be ignored
by default. If you're not you'll also want to include `publish/` so the sensitive `publish/config.json`
does not get committed to a public repo.
