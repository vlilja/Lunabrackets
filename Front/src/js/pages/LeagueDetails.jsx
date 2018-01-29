import React from 'react';
import { connect } from 'react-redux';
import {
  getLeague,
  getLeagueResults,
  startLeague,
  startQualifiers,
  getLeagueGroups,
  getUndetermined,
  updateUndetermined,
  updateGroupStageMatch,
  getQualifierMatches,
  getEliminationMatches,
  getFinalsMatches,
  updateEliminationMatch,
  updateQualifierMatch,
  updateFinalsMatch,
} from '../actions/leagueActions';
import Icons from '../components/Icons';
import LeagueNavigation from '../components/LeagueNavigation';
import AdminView from '../components/AdminView';
import EliminationView from '../components/EliminationView';
import GroupView from '../components/GroupView';
import QualifiersView from '../components/QualifiersView';
import FinalsView from '../components/FinalsView';
import ResultsView from '../components/ResultsView';
import helper from '../helpers/helper';
import phrases from '../../Phrases';

class LeagueDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view: null,
    };
    this.startLeague = this.startLeague.bind(this);
    this.startQualifiers = this.startQualifiers.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.getResults = this.getResults.bind(this);
    this.getUndetermined = this.getUndetermined.bind(this);
    this.updateUndetermined = this.updateUndetermined.bind(this);
    this.updateEliminationMatch = this.updateEliminationMatch.bind(this);
    this.updateQualifierMatch = this.updateQualifierMatch.bind(this);
    this.updateFinalsMatch = this.updateFinalsMatch.bind(this);
    this.getQualifierMatches = this.getQualifierMatches.bind(this);
    this.getEliminationMatches = this.getEliminationMatches.bind(this);
    this.getFinalsMatches = this.getFinalsMatches.bind(this);
    this.updateGroupStageMatch = this.updateGroupStageMatch.bind(this);
    this.initializeView = this.initializeView.bind(this);
    this.setView = this.setView.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getLeague(this.props.match.params.id));
  }

  componentWillReceiveProps(props) {
    if (props.league && !this.state.view) {
      this.setState({ view: props.league.stage });
    }
  }

  setView(view) {
    this.setState({ view });
  }

  getGroups() {
    if (!this.props.league.groups) {
      this.props.dispatch(getLeagueGroups(this.props.league.id));
    }
  }

  getUndetermined() {
    this.props.dispatch(getUndetermined(this.props.league.id));
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

  getResults() {
    this.props.dispatch(getLeagueResults(this.props.league.id));
  }

  updateUndetermined(group) {
    this.props.dispatch(updateUndetermined(this.props.league.id, group));
  }

  updateEliminationMatch(match) {
    if (this.props.league.stage === 'qualifiers' || this.props.league.stage === 'finals') {
      this.props.dispatch(updateEliminationMatch(this.props.league.id, match));
    }
  }

  updateQualifierMatch(match) {
    if (this.props.league.stage === 'qualifiers') {
      this.props.dispatch(updateQualifierMatch(this.props.league.id, match));
    }
  }

  updateFinalsMatch(match) {
    if (this.props.league.stage === 'finals') {
      this.props.dispatch(updateFinalsMatch(this.props.league.id, match));
    }
  }

  updateGroupStageMatch(groupId, match) {
    this.props.dispatch(updateGroupStageMatch(this.props.league.id, groupId, match));
  }

  startLeague(participants, groupNames, raceTo) {
    this.props.dispatch(startLeague(this.props.league.id, participants, groupNames, raceTo));
  }

  startQualifiers() {
    this.props.dispatch(startQualifiers(this.props.league.id));
  }

  initializeView() {
    switch (this.state.view) {
      case 'ready':
        return <AdminView league={this.props.league} startLeague={this.startLeague} startQualifiers={this.startQualifiers} getGroups={this.getGroups} getUndetermined={this.getUndetermined} updateUndetermined={this.updateUndetermined} />;
      case 'complete':
        return <ResultsView league={this.props.league} loading={this.props.loadingResults} getResults={this.getResults} />;
      case 'elimination':
        return <EliminationView league={this.props.league} getMatches={this.getEliminationMatches} update={this.updateEliminationMatch} />;
      case 'group':
        return <GroupView league={this.props.league} getGroups={this.getGroups} getGroupMatches={this.getGroupMatches} updateGroupStageMatch={this.updateGroupStageMatch} updating={this.props.updating} />;
      case 'qualifiers':
        return <QualifiersView league={this.props.league} players={this.props.league.players} getMatches={this.getQualifierMatches} qualifiers={this.props.league.qualifiers} update={this.updateQualifierMatch} />;
      case 'finals':
        return <FinalsView league={this.props.league} getMatches={this.getFinalsMatches} update={this.updateFinalsMatch} />;
      default:
        return (<div>NOTDONE
        </div>);
    }
  }

  render() {
    let element;
    let modal;
    if (this.props.updating) {
      modal = (<div className="modal-back-ground">
        <div className="col-xs-4 col-xs-offset-4 small-modal dialog">
          <Icons type="LOADING" size="40px" />
        </div>
      </div>);
    } else {
      modal = (<div className={this.props.showMessage ? 'modal-back-ground fade show' : 'modal-back-ground fade'}>
        <div className={this.props.showMessage
          ? 'col-xs-4 col-xs-offset-4 small-modal dialog fade show'
          : 'col-xs-4 col-xs-offset-4 small-modal dialog fade'}
        ><Icons
          type={this.props.error
        ? 'ERROR'
        : 'SUCCESS'}
          size="40px"
          message={this.props.message}
        /></div>
      </div>);
    }
    const view = this.initializeView();
    if (!this.props.league) {
      element = <Icons type="LOADING" size="40px" />;
    } else {
      const gameName = helper.determineGameName(this.props.league.gameType);
      const imageName = helper.determineGameIcon(this.props.league.gameType);
      const raceTo = this.props.league.raceTo ? this.props.league.raceTo : '?';
      element = (<div>
        <h1 className="margin-bottom-double"> <img className="img game-logo" alt="logo" src={`/images/${imageName}`} />{`${this.props.league.name}  `}({`${gameName} , ${phrases.general.raceTo} ${raceTo}`})</h1>

        {modal}
        <LeagueNavigation
          view={this.state.view}
          views={[
          'ready',
          'complete',
          'elimination',
          'group',
          'qualifiers',
          'finals',
        ]}
          setView={this.setView}
        /> {view}
      </div>);
    }
    return (
      <div className="container">
        <div className="col-xs-12">
          {element}
        </div>
      </div>
    );
  }
}

export default connect(store => ({
  league: store.league.selectedLeague,
  error: store.league.error,
  loading: store.league.loading.single,
  loadingResults: store.league.loading.results,
  updating: store.league.loading.update,
  showMessage: store.league.showMessage,
  message: store.league.message,
}))(LeagueDetails);
