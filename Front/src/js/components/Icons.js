import React from "react";
import {connect} from "react-redux";

export default class Icon extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var icon,color;
    var size = this.props.size;
    switch (this.props.type) {
      case "SUCCESS":
        icon = <i className="fa fa-check" style={{
          fontSize: size,
          color: 'green'
        }}></i>
        break;
      case "ERROR":
        icon = <i className="fa fa-exclamation-triangle" style={{
          fontSize: size,
          color: 'red'
        }}></i>
        break;
      case "LOADING":
        icon = <i className="fa fa-circle-o-notch fa-spin" style={{
          fontSize: size,
          color: 'yellow '
        }}></i>
        break;
      case "ARROW-DOWN":
        color = this.props.color ? this.props.color : 'yellow';
        icon = <i class="fa fa-arrow-circle-down" aria-hidden="true" style={{
          fontSize: size,
          color: color
        }}></i>
        break;
        case "ARROW-RIGHT":
          color = this.props.color ? this.props.color : 'yellow';
          icon = <i class="fa fa-arrow-circle-right" aria-hidden="true" style={{
            fontSize: size,
            color: color
          }}></i>
          break;
      case "ARROW-UP":
        icon = <i class="fa fa-arrow-circle-up" aria-hidden="true" style={{
          fontSize: size,
          color: 'yellow '
        }}></i>
        break;
    }
    return (
      <div style={{display:this.props.inline ? 'inline' : 'block'}}>
        <h3 style={{display:this.props.inline ? 'inline' : 'block'}}>{icon} {this.props.message}
        </h3>
      </div>
    )
  }

}
