import React from "react";
import { connect } from "react-redux";
import {  fetchUser } from "../actions/userActions";
import Tournamentform from "./Tournamentform";

@connect((store)=> {
  return {
    view: store.view.view
  }
})


export default class Content extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render () {
    console.log(this.props);
    const view = this.props.view;
    switch(view){
      case 'tournamentForm':
        return (<Tournamentform />);
      break;
      case 'myStats':
        return (<div>MyStats</div>);
      break;
      case 'searchPlayer':
        return (<div>Search Player</div>);
      break;
    default:
      return (<div>This is Lunabrackets</div>)
    }
  }


}
