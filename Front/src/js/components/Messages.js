import React from "react";

export default class Messages extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log('Message' + this.props.message);

        if (this.props.message) {
            return (
                <div style={{textAlign:'center'}}>
                    {(this.props.message.type === 'success')
                        ? <span class="glyphicon glyphicon-ok" style={{color: 'green'}} aria-hidden="true"></span>
                        : <span class="glyphicon glyphicon-exclamation-sign" style={{color: 'red'}} aria-hidden="true"></span>}
                    <h2 style={{display: 'inline-block'}}>{this.props.message.text}</h2>
                </div>
            )
        }
        return <div></div>
    }
}
