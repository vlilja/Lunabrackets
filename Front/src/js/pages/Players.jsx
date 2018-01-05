import React from 'react';
import { connect } from 'react-redux';
import PlayerDetails from '../components/PlayerDetails';
import Icon from '../components/Icons';
import { searchPlayers, getPlayerById } from '../actions/playerActions';

class Players extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.showResults = this.showResults.bind(this);
    this.searchPlayers = this.searchPlayers.bind(this);
    this.showPlayerDetails = this.showPlayerDetails.bind(this);
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  searchPlayers() {
    this.props.dispatch(searchPlayers(this.state.searchValue));
  }

  showPlayerDetails(id) {
    this.props.dispatch(getPlayerById(id));
  }

  showResults() {
    let result;
    if (this.props.fetching) {
      result = <Icon type="LOADING" size="30px" message="" />;
    } else if (this.props.error !== null) {
      result = <Icon type="ERROR" size="30px" message="Error fetching players" />;
    } else if (this.props.searchResults.length > 0) {
      result = this.props.searchResults.map(player => (<a href={`#${player.id}`} onClick={(e) => { e.preventDefault(); this.showPlayerDetails(player.id); }} className="player-tile list-group-item list-group-item-action" key={player.id} value={player.id}>
        {player.firstName}{' '}
        {player.lastName}
      </a>));
      result = (
        <ul className="list-group">{result}</ul>
      );
    }
    return result;
  }

  render() {
    const results = this.showResults();
    return (
      <div className="container">
        <div className="col-xs-6">
          <div className="row">
            <div className="col-xs-6">
              <h2>Search a player</h2>
              <div className="form-group">
                <label htmlFor="playerName">Enter player name
                  <input name="playerName" value={this.state.searchValue} onChange={this.handleChange} className="form-control" type="text" />
                </label>
              </div>
              <div className="form-group">
                <button className="btn" onClick={this.searchPlayers}>Search</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              {results}
            </div>
          </div>
        </div>
        <div className="col-xs-6">
          <PlayerDetails player={this.props.selectedPlayer} />
        </div>
      </div>
    );
  }
}

export default connect(store => ({
  selectedPlayer: store.player.selectedPlayer, searchResults: store.player.searchResults, fetching: store.player.fetching, error: store.player.error,
}))(Players);
