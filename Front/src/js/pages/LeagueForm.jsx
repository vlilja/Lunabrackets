import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import _ from 'lodash';

import phrases from '../../Phrases';
import MainForm from '../components/LeagueMainForm';
import PlayerPick from '../components/LeaguePlayerForm';
import Summary from '../components/LeagueCreationSummary';
import Icon from '../components/Icons';
import Tooltip from '../components/Tooltip';
import { getAllPlayers } from '../actions/playerActions';
import { createLeague } from '../actions/leagueActions';


class LeagueForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stage: {
        league: true,
        player: false,
        summary: false,
      },
      errors: {
        name: false,
        players: false,
      },
      leagueName: '',
      game: '1',
      availablePlayers: [],
      pickedPlayers: [],
      modalOpen: false,
    };
    this.update = this.update.bind(this);
    this.showPickPlayers = this.showPickPlayers.bind(this);
    this.showMainForm = this.showMainForm.bind(this);
    this.showSummary = this.showSummary.bind(this);
    this.controlModal = this.controlModal.bind(this);
    this.createLeague = this.createLeague.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getAllPlayers());
  }

  componentWillReceiveProps(props) {
    if (props.players.length > 0) {
      let availablePlayers = props.players.slice();
      availablePlayers = _.orderBy(availablePlayers, [
        'firstName', 'lastName',
      ], ['asc', 'asc']);
      this.setState({ availablePlayers, loading: false });
    }
  }


  controlModal(bool) {
    this.setState({ modalOpen: bool });
  }

  createLeague() {
    this.controlModal(true);
    const league = {
      name: this.state.leagueName,
      game: this.state.game,
      participants: this.state.pickedPlayers,
    };
    this.props.dispatch(createLeague(league));
  }

  update(obj) {
    this.setState({
      [obj.name]: obj.value,
    });
    if (this.state.leagueName) {
      const { errors } = this.state;
      this.setState({
        errors: {
          ...errors,
          name: false,
        },
      });
    }
    if (this.state.pickedPlayers.length > 0) {
      const { errors } = this.state;
      this.setState({
        errors: {
          ...errors,
          players: false,
        },
      });
    }
  }

  showMainForm(event) {
    event.preventDefault();
    let { stage } = this.state;
    stage = {
      ...stage,
      league: true,
      player: false,
    };
    this.setState({ stage });
  }

  showPickPlayers(event) {
    event.preventDefault();
    let { stage } = this.state;
    const { errors } = this.state;
    if (this.state.leagueName && errors.name === false) {
      stage = {
        ...stage,
        league: false,
        player: true,
      };
      this.setState({ stage });
    } else {
      this.setState({
        errors: {
          ...errors,
          name: true,
        },
      });
    }
  }

  showSummary(event) {
    event.preventDefault();
    let { stage } = this.state;
    const { errors } = this.state;
    if (this.state.pickedPlayers.length > 0 && errors.players === false) {
      stage = {
        ...stage,
        player: false,
        summary: true,
      };
      this.setState({ stage });
    } else {
      this.setState({
        errors: {
          ...errors,
          players: true,
        },
      });
    }
  }

  render() {
    let element;
    if (this.state.stage.league) {
      element = <MainForm update={this.update} leagueName={this.state.leagueName} game={this.state.game} error={this.state.errors.name} next={this.showPickPlayers} />;
    } else if (this.state.stage.player) {
      element = (<PlayerPick
        update={this.update}
        back={this.showMainForm}
        next={this.showSummary}
        error={this.state.errors.players}
        availablePlayers={this.state.availablePlayers}
        loading={this.state.loading}
        pickedPlayers={this.state.pickedPlayers}
      />);
    } else if (this.state.stage.summary) {
      const summary = {
        name: this.state.leagueName,
        game: this.state.game,
        participants: this.state.pickedPlayers,
      };
      element = <Summary back={this.showPickPlayers} createLeague={this.createLeague} summary={summary} />;
    }
    return (
      <div className="container">
        <div className="row">
          <h1 className="margin-bottom-double">{phrases.leagueForm.heading}{' '}
            <Tooltip message={phrases.league.infoText} size="32px" />
          </h1>
          {element}
        </div>
        <Modal
          isOpen={this.state.modalOpen}
          className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal',
        }}
          contentLabel="Info modal"
        >
          <div>
            <div className="col-xs-12">
              {this.props.league.creatingLeague ?
                <div>
                  <h2>{phrases.leagueForm.infoCreatingLeagueHeading}</h2>
                  <Icon type="LOADING" size="30px" message="" />
                </div>
              :
                <div>
                  <h2>{this.props.league.message}</h2>
                  <Icon type={this.props.league.error === null ? 'SUCCESS' : 'ERROR'} size="30px" message="" />
                  <a href="/new-league" className="btn btn-primary">OK</a>
                </div>
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(store => ({
  league: store.league, players: store.player.playerList,
}))(LeagueForm);
