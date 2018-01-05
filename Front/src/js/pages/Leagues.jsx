import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LeagueList from '../components/LeagueList';
import LeagueDetails from './LeagueDetails';
import NoMatch from './NoMatch';

export default class Leagues extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/leagues" exact component={LeagueList} />
          <Route path="/leagues/:id" exact component={LeagueDetails} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}
