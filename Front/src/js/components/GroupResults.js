import React from "react";
import {connect} from "react-redux";
import {getGroupResults} from "../actions/leagueActions";
import Icons from "./Icons";



export default class GroupResults extends React.Component {

  constructor(props){
    super(props);
    this.mapResults = this.mapResults.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getGroupResults(this.props.leagueId, this.props.groupId))
  }

  mapResults() {
    var group = this.props.league.groupResults[this.props.groupId];
    var players = [];
    var sortedPlayers = group.players.sort((a, b) => {
      var num = a.ranking-b.ranking;
      if(num === 0){
        a.tied = true;
        b.tied = true;
      }
      return num;
    })
    sortedPlayers.forEach((player) => {
      var playerDetails = this.props.league.groups[this.props.groupId].players.find((p) => {
        return p.id === player.player_id;
      })
      players.push(<li key={player.player_id} style={player.tied ? {backgroundColor:'red'} : {}} class="list-group-item">{player.ranking +'. '+ playerDetails.firstName + ' ' +playerDetails.lastName}</li>)
    })
    var results =  <div><h3>{this.props.league.groups[this.props.groupId].name}</h3>
    <ul class="list-group">{players}</ul>
    </div>
    return results;
  }


  render() {
    var results;
    if(this.props.league.groupResults && this.props.league.groupResults[this.props.groupId]) {
      results = this.mapResults();
    }
    else {
      results = <Icons type="LOADING" size="30px"/>
    }
    return (<div class="col-xs-12">
      {results}
     </div>)
  }
}
