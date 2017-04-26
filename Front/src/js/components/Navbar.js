import React from "react";
import { connect } from "react-redux";
require ("../../stylesheets/navbar.scss");
import view from "../actions/viewActions";

@connect((store)=> {
  return {

  };
})



export default class Navbar extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (<div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#" onClick={()=>{this.props.dispatch(view.showHomeScreen())}}>Lunabrackets</a>
          </div>
          <ul className="nav navbar-nav">
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#">Tournaments<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#" onClick={()=>{this.props.dispatch(view.showTournamentForm())}}>Create new tournament</a></li>
              </ul>
            </li>
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#">Players<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#" onClick={()=>{this.props.dispatch(view.showMyStats())}}>My stats</a></li>
                <li><a href="#" onClick={()=>{this.props.dispatch(view.showSearchPlayer())}}>Search a player</a></li>
              </ul>
            </li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      </nav>
    </div>)
  }

}
