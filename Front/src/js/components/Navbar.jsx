import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn, logOut } from '../actions/loginActions';
import phrases from '../../Phrases';


class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profileSearchDone: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.user.id === undefined && !this.state.profileSearchDone) {
      this.props.history.push('/new-user');
      this.setState({ profileSearchDone: true });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.props.dispatch(logIn());
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.dispatch(logOut());
  }

  render() {
    const admin = this.props.user.admin === '1';
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">Lunabrackets</Link>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              {!this.props.user.id ? '' :
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    href="#menu"
                  >{phrases.navigation.seasons}<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/seasons">{phrases.navigation.viewSeasons}</Link>
                    </li>
                    { admin
                      ? <li>
                        <Link to="/new-season">{phrases.navigation.createSeason}</Link>
                      </li>
                    : ''}
                  </ul>
                </li>
                <li className="dropdown">
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    href="#menu"
                  >{phrases.navigation.leagues}<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/leagues">{phrases.navigation.viewLeagues}</Link>
                    </li>
                    { admin
                    ? <li>
                      <Link to="/new-league">{phrases.navigation.createLeague}</Link>
                    </li>
                  : '' }
                  </ul>
                </li>
                <li className="dropdown">
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    href="#menu"
                  >{phrases.navigation.tournaments}<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/tournaments">{phrases.navigation.viewTournaments}</Link>
                    </li>
                    {admin
                    ? <li>
                      <Link to="/new-tournament">{phrases.navigation.createTournament}</Link>
                    </li>
                    : ''}
                  </ul>
                </li>
                <li className="dropdown">
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    href="#menu"
                  >{phrases.navigation.players}<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/players">{phrases.navigation.viewPlayers}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              }
              <ul className="nav navbar-nav navbar-right">
                <li>
                  {
                    this.props.user.fbId ?
                      <a href="#menu" onClick={this.handleLogout}>
                        {`(${this.props.user.firstName || this.props.user.fb.details.firstName}
                           ${this.props.user.lastName || this.props.user.fb.details.lastName})
                            ${phrases.general.logout}`}
                      </a> :
                      <a href="#menu" onClick={this.handleLogin}>
                        {phrases.general.login}
                      </a>
                  }
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(store => ({
  user: store.user,
}))(Navbar);
