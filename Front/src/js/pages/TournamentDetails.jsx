import React from 'react';
import { connect } from 'react-redux';

import TournamentResultsForm from '../components/TournamentResultsForm';
import TournamentResults from '../components/TournamentResults';
import Icons from '../components/Icons';
import Modal from '../components/Modal';
import phrases from '../../Phrases';
import { getTournament, getTournamentResults, createTournamentResults } from '../actions/tournamentActions';
import { getAllPlayers } from '../actions/playerActions';

class TournamentDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      resultsFetched: false,
    };
    this.renderModal = this.renderModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createTournamentResults = this.createTournamentResults.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getTournament(this.props.match.params.id));
    this.props.dispatch(getAllPlayers());
  }

  componentWillReceiveProps(props) {
    if (props.tournament && props.tournament.status === 'complete' && !this.state.resultsFetched) {
      this.props.dispatch(getTournamentResults(props.tournament.id));
      this.setState({ resultsFetched: true });
    }
  }

  createTournamentResults(results) {
    this.setState({ modalOpen: true });
    this.props.dispatch(createTournamentResults(this.props.tournament.id, results));
  }

  closeModal() {
    if (!this.props.error) {
      this.props.dispatch(getTournament(this.props.tournament.id));
    }
    this.setState({ modalOpen: false });
  }

  mapTournament() {
    let element = null;
    if (this.props.tournament && this.props.tournament.status === 'ready' && this.props.players) {
      element = (<TournamentResultsForm
        tournament={this.props.tournament}
        players={this.props.players}
        createTournamentResults={this.createTournamentResults}
      />);
    }
    if (this.props.tournament && this.props.tournament.status === 'complete' && this.props.players) {
      element = (<TournamentResults
        tournament={this.props.tournament}
        players={this.props.players}
      />);
    }
    return element;
  }

  renderModal() {
    let modal;
    if (this.props.tournament) {
      modal = (<Modal
        open={this.state.modalOpen}
        classes={
         ['col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal']}
        bgclasses={['modal-back-ground']}
      >
        <div>
          <div className="col-xs-12">
            {this.props.loading ?
              <div>
                <h2>{phrases.messages.creatingTournamentResults}</h2>
                <Icons type="LOADING" size="40px" message="" />
              </div>
            :
              <div>
                <Icons
                  type={this.props.error === null ? 'SUCCESS' : 'ERROR'}
                  size="30px"
                  message={this.props.message}
                />
                <button onClick={this.closeModal} className="btn btn-primary">OK</button>
              </div>
            }
          </div>
        </div>
      </Modal>);
    }
    return modal;
  }

  render() {
    if (this.props.tournament && this.props.tournament.status === 'ready' && this.props.user.admin !== '1') {
      return <div> {phrases.tournamentResults.noResults} </div>;
    }
    const tournament = this.mapTournament();
    const modal = this.renderModal();
    return (<div>{tournament || <Icons type="LOADING" size="40px" />}{modal} </div>);
  }
}

export default connect(store => ({
  user: store.user,
  tournament: store.tournament.selectedTournament,
  loading: store.tournament.loading,
  message: store.tournament.message,
  error: store.tournament.error,
  players: store.player.playerList,
}))(TournamentDetails);
