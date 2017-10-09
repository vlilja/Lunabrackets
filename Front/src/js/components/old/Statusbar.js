import React from "react";


export default class Dashboard extends React.Component {

  constructor(props) {
      super(props);
    }

  render() {
    const {level, text} = this.props;
    switch(level){
      case 1:{
        return (<div className="lunaux-status-bar">
            <div className="one-third">{text}</div>
          </div>)
      }
      case 2:{
        return (<div className="lunaux-status-bar">
            <div className="two-thirds">{text}</div>
          </div>)
      }
      case 3:{
        return (<div className="lunaux-status-bar">
            <div className="full" >{text}</div>
          </div>)
      }
    }
  }


}
