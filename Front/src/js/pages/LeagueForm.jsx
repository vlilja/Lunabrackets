import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import phrases from '../../Phrases';
import MainForm from '../components/LeagueMainForm';
import PlayerPick from '../components/LeaguePlayerForm';
import Summary from '../components/LeagueCreationSummary';
import Icon from '../components/Icons';
import Modal from '../components/Modal';
import Tooltip from '../components/Tooltip';
import { getSeasons } from '../actions/seasonActions';
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
      season: '',
      availablePlayers: [],
      pickedPlayers: [],
      modalOpen: false,
      initialized: false,
    };
    this.update = this.update.bind(this);
    this.showPickPlayers = this.showPickPlayers.bind(this);
    this.showMainForm = this.showMainForm.bind(this);
    this.showSummary = this.showSummary.bind(this);
    this.controlModal = this.controlModal.bind(this);
    this.createLeague = this.createLeague.bind(this);
  }

  componentWillMount() {
    if (this.props.user.token) {
      this.props.dispatch(getAllPlayers(this.props.user));
      this.props.dispatch(getSeasons(this.props.user));
      this.setState({ initialized: true });
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.initialized && props.user.token) {
      this.props.dispatch(getAllPlayers(props.user));
      this.props.dispatch(getSeasons(props.user));
      this.setState({ initialized: true });
    }
    if (props.players.length > 0) {
      let availablePlayers = props.players.slice();
      availablePlayers = _.orderBy(availablePlayers, [
        'firstName', 'lastName',
      ], ['asc', 'asc']);
      this.setState({ availablePlayers, loading: false });
    }
    if (props.seasons.length > 0) {
      this.setState({ season: props.seasons[0].id });
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
      season: this.state.season,
      players: this.state.pickedPlayers,
    };
    const { user } = this.props;
    this.props.dispatch(createLeague(league, user));
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
    if (this.props.user.admin !== '1') {
      return (<Redirect
        to={{
            pathname: '/',
            state: { from: '/new-league' },
          }}
      />);
    }
    let element;
    if (this.state.stage.league) {
      element = (<MainForm
        update={this.update}
        leagueName={this.state.leagueName}
        game={this.state.game}
        season={this.state.season}
        seasons={this.props.seasons}
        error={this.state.errors.name}
        next={this.showPickPlayers}
      />);
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
      const season = this.props.seasons.find(s => s.id === this.state.season);
      const summary = {
        name: this.state.leagueName,
        game: this.state.game,
        season: season.name,
        participants: this.state.pickedPlayers,
      };
      element = <Summary back={this.showPickPlayers} createLeague={this.createLeague} summary={summary} />;
    }
    return (
      <div className="container">
        <div>
          <h1 className="margin-bottom-double">{phrases.leagueForm.heading}{' '}
            <Tooltip message={phrases.league.infoText} size="32px" />
          </h1>
          {element}
        </div>
        <Modal
          open={this.state.modalOpen}
          classes={
           ['col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal']}
          bgclasses={['modal-back-ground']}
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
                  <Icon
                    type={this.props.league.error === null ? 'SUCCESS' : 'ERROR'}
                    size="30px"
                    message={this.props.league.message}
                  />
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
  user: store.user,
  league: store.league,
  players: store.player.playerList,
  seasons: store.season.seasons,
}))(LeagueForm);
