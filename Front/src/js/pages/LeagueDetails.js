import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {getLeague, startLeague, getLeagueGroups, getUndetermined, updateUndetermined, getLeagueGroupMatches, updateGroupStageMatch, getQualifierMatches, getEliminationMatches, getFinalsMatches, updateEliminationMatch} from "../actions/leagueActions";
import Icons from "../components/Icons";
import LeagueNavigation from "../components/LeagueNavigation";
import AdminView from "../components/AdminView";
import EliminationView from "../components/EliminationView";
import GroupView from "../components/GroupView";
import QualifiersView from "../components/QualifiersView";
import FinalsView from "../components/FinalsView";

@connect((store) => {
  return {
    league: store.league.selectedLeague,
    error: store.league.error,
    loading: store.league.loading.single,
    updating: store.league.loading.update,
    showMessage: store.league.showMessage,
    message: store.league.message
  }
})

export default class LeagueDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view: null
    }
    this.startLeague = this.startLeague.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.getUndetermined = this.getUndetermined.bind(this);
    this.updateUndetermined = this.updateUndetermined.bind(this);
    this.updateEliminationMatch = this.updateEliminationMatch.bind(this);
    this.getQualifierMatches = this.getQualifierMatches.bind(this);
    this.getEliminationMatches = this.getEliminationMatches.bind(this);
    this.getFinalsMatches = this.getFinalsMatches.bind(this);
    this.updateGroupStageMatch = this.updateGroupStageMatch.bind(this);
    this.initializeView = this.initializeView.bind(this);
    this.setView = this.setView.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.league && !this.state.view) {
      this.setState({view: props.league.stage});
    }
  }

  startLeague(participants, groups, raceTo) {
    this.props.dispatch(startLeague(this.props.league.id, participants, groups, raceTo));
  }

  updateGroupStageMatch(groupId, match) {
    this.props.dispatch(updateGroupStageMatch(this.props.league.id, groupId, match));
  }

  getGroups() {
    if(!this.props.league.groups){
    this.props.dispatch(getLeagueGroups(this.props.league.id));
    }
  }

  getUndetermined() {
    this.props.dispatch(getUndetermined(this.props.league.id));
  }

  updateUndetermined(group) {
    this.props.dispatch(updateUndetermined(this.props.league.id, group));
  }

  updateEliminationMatch(match) {
    this.props.dispatch(updateEliminationMatch(this.props.league.id, match));
  }

  getQualifierMatches() {
    this.props.dispatch(getQualifierMatches(this.props.league.id));
  }

  getEliminationMatches() {
    this.props.dispatch(getEliminationMatches(this.props.league.id));
  }

  getFinalsMatches() {
    this.props.dispatch(getFinalsMatches(this.props.league.id));
  }

  setView(view) {
    this.setState({view: view});
  }



  initializeView() {
    switch (this.state.view) {
      case 'ready':
        return <AdminView league={this.props.league} startLeague={this.startLeague} getGroups={this.getGroups} getUndetermined={this.getUndetermined} updateUndetermined={this.updateUndetermined}/>
        break;
      case 'elimination':
        return <EliminationView league={this.props.league} getMatches={this.getEliminationMatches} update={this.updateEliminationMatch} />
      case 'group':
        return <GroupView league={this.props.league} getGroups={this.getGroups} getGroupMatches={this.getGroupMatches} updateGroupStageMatch={this.updateGroupStageMatch} updating={this.props.updating}></GroupView>
        break;
      case 'qualifiers':
        return <QualifiersView league={this.props.league} players={this.props.league.participants} getMatches={this.getQualifierMatches} qualifiers={this.props.league.qualifiers} />
        break;
      case 'finals':
        return <FinalsView league={this.props.league} getMatches={this.getFinalsMatches} />
        break;
      default:
        return <div>NOTDONE </div>
        break;
    }
  }

  componentWillMount() {
    this.props.dispatch(getLeague(this.props.match.params.id))
  }

  render() {
    var element;
    var view = this.initializeView();
    if (!this.props.league) {
      element = <Icons type="LOADING" size="40px"/>
    } else {
      element = <div>
        <h1 class="margin-bottom-double">{this.props.league.name}</h1>
        <div class={this.props.showMessage
          ? 'col-xs-4 col-xs-offset-2 small-modal dialog fade show'
          : 'col-xs-4 col-xs-offset-2 small-modal dialog fade'}><Icons type={this.props.error
        ? 'ERROR'
        : "SUCCESS"} size="40px" message={this.props.message}/></div>
      <LeagueNavigation view={this.state.view} views={['ready', 'results', 'elimination', 'group', 'qualifiers', 'finals']} setView={this.setView}/> {view}
      </div>
    }
    return (
      <div class="container">
        <div class="col-xs-12">
          {element}
        </div>
      </div>
    )
  }
}
