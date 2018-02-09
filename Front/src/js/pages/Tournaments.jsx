import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NoMatch from './NoMatch';
import TournamentList from '../components/TournamentList';
import TournamentDetails from './TournamentDetails';

export default class Tournaments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<div className="container"><Switch>
      <Route path="/tournaments" exact component={TournamentList} />
      <Route path="/tournaments/:id" exact component={TournamentDetails} />
      <Route component={NoMatch} />
    </Switch></div>);
  }

}
