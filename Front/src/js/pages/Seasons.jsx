import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SeasonList from '../components/SeasonList';
import SeasonDetails from '../components/SeasonDetails';
import NoMatch from './NoMatch';

export default class Seasons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <Switch>
          <Route path="/seasons" exact component={SeasonList} />
          <Route path="/seasons/:id" exact component={SeasonDetails} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }

}
