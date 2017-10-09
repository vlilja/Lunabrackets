import React from "react";
import phrases from "../../Phrases";
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {getAllLeagues} from "../actions/leagueActions"
import LeagueList from "../components/LeagueList"
import LeagueDetails from "./LeagueDetails";
import NoMatch from "./NoMatch"

export default class Leagues extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/leagues" exact component={LeagueList}></Route>
          <Route path="/leagues/:id" exact component={LeagueDetails}></Route>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    )
  }
}
