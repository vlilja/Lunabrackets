import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Frontpage from './pages/Frontpage';
import Tournaments from './pages/Tournaments';
import Players from './pages/Players';
import Leagues from './pages/Leagues';
import Seasons from './pages/Seasons';
import LeagueForm from './pages/LeagueForm';
import NoMatch from './pages/NoMatch';
import store from './store';
import '../scss/base.scss';

const app = document.getElementById('app');
ReactDOM.render(<Provider store={store}>
  <Router>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Frontpage} />
        <Route path="/tournaments" component={Tournaments} />
        <Route path="/players" component={Players} />
        <Route path="/leagues" component={Leagues} />
        <Route path="/seasons" component={Seasons} />
        <Route path="/new-league" component={LeagueForm} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
</Provider>, app);
