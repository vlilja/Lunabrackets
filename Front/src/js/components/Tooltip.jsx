import React from 'react';

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
    };
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
  }

  showMessage() {
    this.setState({ showMessage: true });
  }

  hideMessage() {
    this.setState({ showMessage: false });
  }

  render() {
    return (
      <span className="lunabrackets-tooltip" onMouseEnter={this.showMessage} onMouseLeave={this.hideMessage}>
        <i className="fa fa-info-circle" style={{ fontSize: this.props.size }} />
        { this.state.showMessage ? <div className="message-container"><span className="message"><p>{this.props.message}</p></span></div> : '' }
      </span>
    );
  }

}
