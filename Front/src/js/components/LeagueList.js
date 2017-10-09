import React from "react";
import phrases from "../../Phrases";
import {connect} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {getAllLeagues, getLeague} from "../actions/leagueActions";
import LeaguePanel from "./LeaguePanel";
import Icons from "./Icons";

@connect((store) => {
  return {leagues: store.league.leagueList, loading: store.league.loading.list}
})

export default class LeagueList extends React.Component {

  constructor(props) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentWillMount() {
    if (!this.props.leagues) {
      this.props.dispatch(getAllLeagues());
    }
  }

  navigateTo(leagueId) {
    this.props.history.push(this.props.match.path+"/"+leagueId);
  }

  selectLeague(leagueId) {
    this.props.dispatch(getLeague(leagueId));
  }

  render() {
    var mappedLeagues;
    if (this.props.leagues) {
      mappedLeagues = this.props.leagues.map((league, idx) => {
        return <div class="col-lg-3 col-xs-6" key={idx}><LeaguePanel navigateTo={this.navigateTo} league={league}/></div>
      })
    }
    console.log(this.props);
    return (
      <Router>
        <div class="container">
          {this.props.loading
            ? <Icons type="LOADING" size="40px"/>
            : mappedLeagues}
        </div>
      </Router>
    )
  }

}
