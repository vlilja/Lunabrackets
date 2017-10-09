import React from "react";
import phrases from "../../Phrases";
import MainForm from "../components/LeagueMainForm";
import PlayerPick from "../components/LeaguePlayerForm";
import Summary from "../components/LeagueCreationSummary";
import Icon from "../components/Icons";
import serverDetails from "../apiDetails";
import {connect} from "react-redux";
import {getAllPlayers} from "../actions/playerActions";
import {createLeague} from "../actions/leagueActions";
import Modal from "react-modal";
import _ from "lodash";

@connect((store) => {
  return {league: store.league, players: store.player.playerList};
})
export default class LeagueForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stage: {
        league: true,
        player: false,
        summary: false
      },
      errors: {
        name: false,
        players: false
      },
      leagueName: '',
      game: '1',
      availablePlayers: [],
      pickedPlayers: [],
      modalOpen: false,
      loadingPlayers:true
    }
    this.update = this.update.bind(this);
    this.showPickPlayers = this.showPickPlayers.bind(this);
    this.showMainForm = this.showMainForm.bind(this);
    this.showSummary = this.showSummary.bind(this);
    this.controlModal = this.controlModal.bind(this);
    this.createLeague = this.createLeague.bind(this);
  }

  componentWillMount(){
    this.props.dispatch(getAllPlayers());
  }

componentWillReceiveProps(props) {
  if(props.players.length > 0) {
    var availablePlayers = props.players.slice();
    availablePlayers =_.orderBy(availablePlayers, [
      'firstName', 'lastName'
    ], ['asc', 'asc']);
    this.setState({availablePlayers : availablePlayers, loading:false});
  }
}

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  controlModal(bool) {
    this.setState({modalOpen: bool});
  }

  createLeague() {
    this.controlModal(true);
    var league = {
      name: this.state.leagueName,
      game: this.state.game,
      participants: this.state.pickedPlayers
    }
    this.props.dispatch(createLeague(league));
  }

  update(obj) {
    this.setState({
      [obj.name]: obj.value
    });
    if (this.state.leagueName) {
      var errors = this.state.errors
      this.setState({
        errors: {
          ...errors,
          name: false
        }
      });
    }
    if (this.state.pickedPlayers.length > 0) {
      var errors = this.state.errors
      this.setState({
        errors: {
          ...errors,
          players: false
        }
      });
    }
  }

  showMainForm(event) {
    event.preventDefault();
    var stage = this.state.stage;
    stage = {
      ...stage,
      league: true,
      player: false
    }
    this.setState({stage: stage});
  }

  showPickPlayers(event) {
    event.preventDefault();
    var stage = this.state.stage;
    var errors = this.state.errors;
    if (this.state.leagueName && errors.name === false) {
      stage = {
        ...stage,
        league: false,
        player: true
      }
      this.setState({stage: stage});
    } else {
      this.setState({
        errors: {
          ...errors,
          name: true
        }
      });
    }
  }

  showSummary(event) {
    event.preventDefault();
    var stage = this.state.stage;
    var errors = this.state.errors;
    if (this.state.pickedPlayers.length > 0 && errors.players === false) {
      stage = {
        ...stage,
        player: false,
        summary: true
      }
      this.setState({stage: stage});
    } else {
      this.setState({
        errors: {
          ...errors,
          players: true
        }
      });
    }
  }

  render() {
    var element;
    if (this.state.stage.league) {
      element = <MainForm update={this.update} leagueName={this.state.leagueName} game={this.state.game} error={this.state.errors.name} next={this.showPickPlayers}/>
    } else if (this.state.stage.player) {
      element = <PlayerPick update={this.update} back={this.showMainForm}
        next={this.showSummary} error={this.state.errors.players}
        availablePlayers={this.state.availablePlayers}
        loading={this.state.loading}
        pickedPlayers={this.state.pickedPlayers}/>
    } else if (this.state.stage.summary) {
      var summary = {
        name: this.state.leagueName,
        game: this.state.game,
        participants: this.state.pickedPlayers
      }
      element = <Summary back={this.showPickPlayers} createLeague={this.createLeague} summary={summary}/>
    }
    return (
      <div className="container">
        <div class="row">
          <h1 class="margin-bottom-double">{phrases.leagueForm.heading}{' '}
            <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" data-html="true" aria-hidden="true" title={phrases.league.infoText}></i>
          </h1>
          {element}
        </div>
        <Modal isOpen={this.state.modalOpen} className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal'
        }} contentLabel="Info modal">
          <div>
            <div class="col-xs-12">
              {this.props.league.creatingLeague ?
              <div>
              <h2>{phrases.leagueForm.infoCreatingLeagueHeading}</h2>
              <Icon type="LOADING" size='30px' message=""/>
              </div>
              :
              <div>
              <h2>{this.props.league.message}</h2>
              <Icon type={this.props.league.error === null ? 'SUCCESS' : 'ERROR'} size='30px' message=""/>
              <a href="/new-league" class="btn btn-primary">OK</a>
              </div>
              }
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
