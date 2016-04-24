import * as React from 'react';
import { User } from './User';
import { reduxify } from './utils';

@reduxify(
    (state) => ({
        messages: state.messages.filter(m => !m.channel || m.channel === state.selectedChannel),        users: state.users,        activeSub: state.activeSub    })
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
