import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkLoginStatus } from '../actions/loginActions';
import phrases from '../../Phrases';


class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profileSearchDone: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.user.id === undefined && !this.state.profileSearchDone) {
      this.props.history.push('/new-user');
      this.setState({ profileSearchDone: true });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.props.dispatch(checkLoginStatus());
  }

  render() {
    const admin = this.props.user.admin === '1';
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
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">{phrases.navigation.seasons}<span className="caret" />
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
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">{phrases.navigation.leagues}<span className="caret" />
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
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">{phrases.navigation.tournaments}<span className="caret" />
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
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" href="#menu">{phrases.navigation.players}<span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/players">{phrases.navigation.viewPlayers}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#menu" onClick={this.handleLogin}>
                    {this.props.user.fbId
                      ? `(${this.props.user.firstName} ${this.props.user.lastName}) ${phrases.general.logout}`
                         : phrases.general.login }
                  </a>
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
