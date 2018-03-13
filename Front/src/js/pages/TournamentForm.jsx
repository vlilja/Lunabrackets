import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createTournament } from '../actions/tournamentActions';
import { getSeasons } from '../actions/seasonActions';
import Icons from '../components/Icons';
import Modal from '../components/Modal';
import phrases from '../../Phrases';

class TournamentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      game: '1',
      season: '',
      modalOpen: false,
      seasonsFetched: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    if (this.props.user.token) {
      this.props.dispatch(getSeasons(this.props.user));
      this.setState({ seasonsFetched: true });
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.seasonsFetched && props.user.token) {
      this.props.dispatch(getSeasons(this.props.user));
      this.setState({ seasonsFetched: true });
    }
    if (props.seasons.length > 0) {
      this.setState({ season: props.seasons[0].id });
    }
  }

  handleChange(e) {
    const { target } = e;
    const { name, value } = target;
    switch (name) {
      case 'name':
        this.setState({ name: value });
        break;
      case 'game':
        this.setState({ game: value });
        break;
      case 'season':
        this.setState({ season: value });
        break;
      default:
        break;
    }
  }

  controlModal(bool) {
    this.setState({ modalOpen: bool });
  }

  submit(e) {
    e.preventDefault();
    const tournament = { name: this.state.name, game: this.state.game, season: this.state.season };
    this.props.dispatch(createTournament(tournament, this.props.user));
    this.controlModal(true);
  }

  renderOptions() {
    const { seasons } = this.props;
    const options = [];
    if (seasons) {
      seasons.forEach((season) => {
        options.push((<option key={season.id} value={season.id}>{season.name}</option>));
      });
    }
    return options;
  }

  render() {
    if (this.props.user.admin !== '1') {
      return (<Redirect
        to={{
            pathname: '/',
            state: { from: '/new-tournament' },
          }}
      />);
    }
    const options = this.renderOptions();
    return (<div className="container">
      <div className="col-xs-12">
        <h2>{phrases.tournamentForm.heading}</h2>
        <div className="col-lg-6 col-xs-12 well">
          <form className="form-horizontal" autoComplete="off">
            <div className="form-group">
              <label className="control-label col-xs-2" htmlFor="name">{phrases.tournamentForm.name}</label>
              <div
                className="col-xs-6"
              ><input
                name="name"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.name}
                type="text"
              /></div>
            </div>
            <div className="form-group">
              <span className="col-xs-2 control-label">{phrases.leagueForm.game}</span>
              <div className="col-xs-10">
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="game"
                      id="eight"
                      onChange={this.handleChange}
                      value="1"
                      checked={this.state.game === '1'}
                    />
                    {phrases.general.games.eight}
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="game"
                      id="nine"
                      onChange={this.handleChange}
                      value="2"
                      checked={this.state.game === '2'}
                    />
                    {phrases.general.games.nine}
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="game"
                      id="ten"
                      onChange={this.handleChange}
                      value="3"
                      checked={this.state.game === '3'}
                    />
                    {phrases.general.games.ten}
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="game"
                      id="straight"
                      onChange={this.handleChange}
                      value="4"
                      checked={this.state.game === '4'}
                    />
                    {phrases.general.games.straight}
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <span className="col-xs-2 control-label">{phrases.leagueForm.season}</span>
              <div className="col-xs-10">
                <label htmlFor="season">
                  <select
                    name="season"
                    value={this.state.season}
                    onChange={this.handleChange}
                    multiple=""
                    className="form-control"
                    id="season"
                  >
                    {options}
                  </select>
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-12">
                <button className="btn btn-primary" onClick={this.submit}>{phrases.tournamentForm.create}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal
        open={this.state.modalOpen}
        classes={
         ['col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal']}
        bgclasses={['modal-back-ground']}
      >
        <div>
          <div className="col-xs-12">
            {this.props.tournament.loading ?
              <div>
                <h2>{phrases.messages.creatingTournament}</h2>
                <Icons type="LOADING" size="40px" message="" />
              </div>
            :
              <div>
                <Icons
                  type={this.props.tournament.error === null ? 'SUCCESS' : 'ERROR'}
                  size="30px"
                  message={this.props.tournament.message}
                />
                <a href="/new-tournament" className="btn btn-primary">OK</a>
              </div>
            }
          </div>
        </div>
      </Modal>
    </div>);
  }
}

export default connect(store => ({
  user: store.user,
  league: store.league,
  players: store.player.playerList,
  seasons: store.season.seasons,
  tournament: store.tournament,
}))(TournamentForm);
