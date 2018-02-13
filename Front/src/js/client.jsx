import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Frontpage from './pages/Frontpage';
import Tournaments from './pages/Tournaments';
import TournamentForm from './pages/TournamentForm';
import Players from './pages/Players';
import Leagues from './pages/Leagues';
import Seasons from './pages/Seasons';
import LeagueForm from './pages/LeagueForm';
import SeasonForm from './pages/SeasonForm';
import UserForm from './pages/UserForm';
import NoMatch from './pages/NoMatch';
import store from './store';
import '../scss/base.scss';

const app = document.getElementById('app');
ReactDOM.render(<Provider store={store}>
  <Router>
    <div>
      <Route component={Navbar} />
      <Switch>
        <Route exact path="/" component={Frontpage} />
        <Route path="/tournaments" component={Tournaments} />
        <Route path="/new-tournament" component={TournamentForm} />
        <Route path="/players" component={Players} />
        <Route path="/leagues" component={Leagues} />
        <Route path="/seasons" component={Seasons} />
        <Route path="/new-league" component={LeagueForm} />
        <Route path="/new-season" component={SeasonForm} />
        <Route path="/new-user" component={UserForm} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
</Provider>, app);
