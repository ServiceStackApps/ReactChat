import * as React from 'react';

export class User extends React.Component<any, any> {
    render() {
        return ( 
            <div className="user">
                <img src={this.props.user.profileUrl || "/img/no-profile64.png"}/>
                <span onClick={this.props.onSelect}>
                    {this.props.user.displayName}
                </span>
            </div>
        );
    }
}