import React from 'react';

export default class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let modal;
    const classes = this.props.classes.join(' ');
    const bgclasses = this.props.bgclasses.join(' ');
    if (this.props.open) {
      modal = (<div id="modal-bg" className={bgclasses}>
        <div id="modal-content-wrapper" className={classes} >
          <div id="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>);
    } else {
      modal = '';
    }
    return <div>{ modal }</div>;
  }

}
