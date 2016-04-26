import * as React from "react";
import { reduxify } from './utils';

@reduxify(
    (state) => ({
        users: state.users,        activeSub: state.activeSub,        value: state.value,        historyIndex: state.historyIndex,        msgHistory: state.msgHistory,    }),
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

