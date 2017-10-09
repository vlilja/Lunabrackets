import React from "react";
import {connect} from "react-redux";

export default class Icon extends React.Component {

constructor(props) {
  super(props);
}

render () {
  var icon;
  var size = this.props.size;
  switch (this.props.type){
    case "SUCCESS":
      icon = <i className="fa fa-check" style={{fontSize:size, color:'green'}}></i>
      break;
    case "ERROR":
      icon = <i className="fa fa-exclamation-triangle" style={{fontSize:size, color:'red'}}></i>
      break;
    case "LOADING":
      icon = <i className="fa fa-circle-o-notch fa-spin" style={{fontSize:size, color:'yellow ' }}></i>
      break;
  }
  return (<div> <h3>{icon} {this.props.message} </h3></div>)
}

}
