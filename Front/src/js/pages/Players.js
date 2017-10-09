import React from "react";
import {connect} from "react-redux";
import PlayerDetails from "../components/PlayerDetails";
import Icon from "../components/Icons";
import {searchPlayers} from "../actions/playerActions";
import {getPlayerById} from "../actions/playerActions";

@connect((store) => {
  return {selectedPlayer: store.player.selectedPlayer, searchResults: store.player.searchResults, fetching: store.player.fetching, error: store.player.error};
})

export default class Players extends React.Component {

  constructor() {
    super();
    this.state = {
      searchValue: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.showResults = this.showResults.bind(this);
    this.searchPlayers = this.searchPlayers.bind(this);
    this.showPlayerDetails = this.showPlayerDetails.bind(this);
  }

  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }

  searchPlayers() {
    this.props.dispatch(searchPlayers(this.state.searchValue));
  }

  showPlayerDetails(id) {
    this.props.dispatch(getPlayerById(id));
  }

  showResults() {
    var result;
    if (this.props.fetching) {
      result = <Icon type="LOADING" size='30px' message=""/>
    } else if (this.props.error !== null) {
      result = <Icon type="ERROR" size='30px' message="Error fetching players"/>
    } else if (this.props.searchResults.length > 0) {
      result = this.props.searchResults.map((player, index) => <a href={'#'+player.id} onClick={(e)=>{e.preventDefault();this.showPlayerDetails(player.id)}} className="player-tile list-group-item list-group-item-action" key={index} value={player.id}>
        {player.firstName}{' '}
        {player.lastName}</a>)
      console.log(result);
      result = (
        <ul className="list-group">{result}</ul>
      );
    }
    return result;
  }

  render() {
    var results = this.showResults();
    return (
      <div className="container">
        <div className="col-xs-6">
          <div className="row">
            <div className="col-xs-6">
              <h2>Search a player</h2>
              <div className="form-group">
                <label for="playerName">Enter player name
                </label>
                <input name="playerName" value={this.state.searchValue} onChange={this.handleChange} className="form-control" type="text"></input>
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
          <PlayerDetails player={this.props.selectedPlayer}></PlayerDetails>
        </div>
      </div>
    )
  }

};
