import React from "react";
import { connect } from "react-redux";
import view from "../actions/viewActions";
import { Link } from 'react-router-dom'



export default class Navbar extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (<div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
              <Link className="navbar-brand" to="/">Lunabrackets</Link>
          </div>
          <ul className="nav navbar-nav">
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#">Leagues<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/leagues">View all leagues</Link></li>
                <li><Link to="/new-league">Create new league</Link></li>
              </ul>
            </li>
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#">Tournaments<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/tournaments">View all tournaments</Link></li>
                <li><Link to="/new-tournament">Create new tournament</Link></li>
              </ul>
            </li>
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#">Players<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/players">Show players</Link></li>
              </ul>
            </li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      </nav>
    </div>)
  }

}
