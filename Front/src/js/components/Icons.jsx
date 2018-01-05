import React from 'react';

export default class Icon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let icon;
    let color;
    const { size, type } = this.props;
    switch (type) {
      case 'SUCCESS':
        icon = (<i
          className="fa fa-check"
          style={{
          fontSize: size,
          color: 'green',
        }}
        />);
        break;
      case 'ERROR':
        icon = (<i
          className="fa fa-exclamation-triangle"
          style={{
          fontSize: size,
          color: 'red',
        }}
        />);
        break;
      case 'LOADING':
        icon = (<i
          className="fa fa-circle-o-notch fa-spin"
          style={{
          fontSize: size,
          color: 'yellow ',
        }}
        />);
        break;
      case 'ARROW-DOWN':
        color = this.props.color ? this.props.color : 'yellow';
        icon = (<i
          className="fa fa-arrow-circle-down"
          aria-hidden="true"
          style={{
          fontSize: size,
          color,
        }}
        />);
        break;
      case 'ARROW-RIGHT':
        color = this.props.color ? this.props.color : 'yellow';
        icon = (<i
          className="fa fa-arrow-circle-right"
          aria-hidden="true"
          style={{
            fontSize: size,
            color,
          }}
        />);
        break;
      case 'ARROW-UP':
        icon = (<i
          className="fa fa-arrow-circle-up"
          aria-hidden="true"
          style={{
          fontSize: size,
          color: 'yellow ',
        }}
        />);
        break;
      default:
        icon = '';
        break;
    }
    return (
      <div style={{ display: this.props.inline ? 'inline' : 'block' }}>
        <h3 style={{ display: this.props.inline ? 'inline' : 'block' }}>{icon} {this.props.message}
        </h3>
      </div>
    );
  }

}
