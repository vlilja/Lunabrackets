import React from 'react';
import { Link } from 'react-router-dom';


export default class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">Lunabrackets</Link>
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">Seasons<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/seasons">View all seasons</Link>
                    </li>
                    <li>
                      <Link to="/new-season">Create new season</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">Leagues<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/leagues">View all leagues</Link>
                    </li>
                    <li>
                      <Link to="/new-league">Create new league</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">Tournaments<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/tournaments">View all tournaments</Link>
                    </li>
                    <li>
                      <Link to="/new-tournament">Create new tournament</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">Players<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/players">Show players</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#logout">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }

}
