import * as React from "react";

import { reduxify } from './utils';

@reduxify(
    (state) => ({
        selectedChannel: state.selectedChannel,
        users: state.users,        activeSub: state.activeSub,        value: state.value,        historyIndex: state.historyIndex,        msgHistory: state.msgHistory,    }),
    (dispatch) => ({
        showError: (message:string) => dispatch({ type:'ERRORS_SHOW', message }),
        addMessageHistory: (message:string) => dispatch({ type:'MESSAGEHISTORY_ADD', message }),
        setHistoryIndex: (index: number) => dispatch({ type: 'MESSAGEHISTORY_INDEX', index }),
        setValue: (value:string) => dispatch({ type:'VALUE_SET', value })
    })
)
export class Footer extends React.Component<any, any> {
    //mixins:[ 
    //    Reflux.listenTo(Actions.userSelected,"userSelected"), 
    //    Reflux.listenTo(Actions.setText,"setText")
    //],

    componentDidMount() {
        this.txtMsg.focus();
    }

    get txtMsg(): HTMLInputElement {
        return this.refs["txtMsg"] as HTMLInputElement;
    }

    postMsg() {
        var msg = this.txtMsg.value,
            parts,
            to = null,
            activeSub = this.props.activeSub;

        if (msg) {
            this.props.addMessageHistory(msg);
        }

        if (msg[0] === "@") {
            parts = $.ss.splitOnFirst(msg, " ");
            var toName = parts[0].substring(1);
            if (toName === "me") {
                to = activeSub.userId;
            } else {
                const toUser = this.props.users.filter(user => user.displayName === toName.toLowerCase())[0];
                to = toUser ? toUser.userId : null;
            }
            msg = parts[1];
        }
        if (!msg || !activeSub) return;
        const onError = e => {
            if (e.responseJSON && e.responseJSON.responseStatus)
                this.props.showError(e.responseJSON.responseStatus.message);
        };
        if (msg[0] === "/") {
            parts = $.ss.splitOnFirst(msg, " ");
            $.post(`/channels/${this.props.selectedChannel}/raw`, {
                    from: activeSub.id,
                    toUserId: to,
                    message: parts[1],
                    selector: parts[0].substring(1)
                },
                () => { }
            ).fail(onError);
        } else {
            $.post(`/channels/${this.props.selectedChannel}/chat`, {
                    from: activeSub.id,
                    toUserId: to,
                    message: msg,
                    selector: "cmd.chat"
                },
                () => { }
            ).fail(onError);
        }

        this.props.setValue("");
    }

    userSelected(user) {
        this.setText(`@${user.displayName} `);
    }

    setText(txt) {
        this.props.setValue(txt).then(() => {
            this.txtMsg.focus();
        });
    }

    handleChange(e) {
        this.props.setValue(e.target.value);
    }

    handleKeyDown(e) {
        const keycode = e.keyCode;
        var value = this.props.value;

        if ($.ss.getSelection()) {
            if (keycode === "9" || keycode === "13" || keycode === "32" || keycode === "39") {

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
        if (keycode === "13") { //enter
            this.props.setHistoryIndex(-1);
            this.postMsg();
        } else if (keycode === "38") { //up arrow
            this.props.setHistoryIndex(Math.min(++this.props.historyIndex, msgHistory.length));
            this.props.setValue(this.props.msgHistory[msgHistory.length - 1 - this.props.historyIndex]);
            e.preventDefault();
        }
        else if (keycode === "40") { //down arrow
            this.props.setHistoryIndex(Math.max(--this.props.historyIndex, -1));
            this.props.setValue(msgHistory[msgHistory.length - 1 - this.props.historyIndex]);
        } else {
            this.props.setHistoryIndex(-1);
        }
    }

    handleKeyUp(e) {
        var value = this.props.value,
            activeSub = this.props.activeSub;

        if (!$.ss.getSelection() && value[0] === "@" && value.indexOf(" ") < 0) {
            var partialVal = value.substring(1);

            var matchingNames = this.props.users
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
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp} />
                <button id="btnSend" style={{ marginLeft: 5 }} onClick={this.postMsg}>Send</button>
            </div>
        );
    }
}
