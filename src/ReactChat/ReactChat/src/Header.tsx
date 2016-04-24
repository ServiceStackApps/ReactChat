import * as React from "react";
import { reduxify } from './utils';

@reduxify(
    (state) => ({
        channels: state.channels,        selectedChannel: state.selectedChannel,        isAuthenticated: state.isAuthenticated,        activeSub: state.activeSub    }),
    (dispatch) => ({
        selectChannel: (channel:string) => dispatch({ type: 'CHANNELS_SELECT', channel }),
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
        this.props.selectChannel(e.target.getAttribute("data-channel"));
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