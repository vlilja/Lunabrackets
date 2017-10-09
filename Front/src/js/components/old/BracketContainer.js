import React from "react";
import {connect} from "react-redux";
import BracketColumn from "./BracketColumn";
import { getSingleEliminationMatches, fetchParticipants, updateSingleEliminationMatch, updateMatches } from "../actions/tournamentActions";
require ('../../stylesheets/brackets.scss');

@connect((store) => {
    return {matches: store.tournament.selectedTournamentMatches};
})

export default class BracketContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            winnerSide:this.props.matches.winnerSide,
            loserSide:this.props.matches.loserSide,
            brackets: [],
            rounds: 0
        }
        this.splitMatchesToColumns = this.splitMatchesToColumns.bind(this);
        this.updateMatch = this.updateMatch.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchParticipants(this.props.tournamentId));
        this.props.dispatch(getSingleEliminationMatches(this.props.tournamentId));
    }

    splitMatchesToColumns() {
        var brackets = [];
        var matches = this.props.matches.slice();
        var bracket = [];
        var k = (matches.length + 1) / 2;
        var i = 1;
        while (matches.length > 0) {
            if (i === k) {
                bracket.push(matches.shift());
                brackets.push(bracket);
                i = 1;
                k /= 2;
                bracket = []
            } else {
                bracket.push(matches.shift());
                i++;
            }
        }
        return brackets;
    }

    updateMatch(match) {
      var nextMatch = null;
      var loserMatch = null;
      var winner;
      var matches = this.props.matches
      match.complete = 'Y';
      for(var key in matches){
        if(matches[key].number === match.number){
          matches[key] = match;
        }
        if(matches[key].number === match.nextMatch){
          nextMatch = matches[key];
        }
        if(matches[key].number === match.loserNextMatch){
          loserMatch = matches[key];
        }
      }
      if(match.playerOneScore > match.playerTwoScore){
        winner = match.playerOne;
      }
      else {
        winner = match.playerTwo;
      }
      if(match.number % 2 === 0){
        nextMatch.playerTwo = winner;
      }
      else {
        nextMatch.playerOne = winner;
      }
      this.props.dispatch(updateMatches(matches));
      //this.props.dispatch(updateSingleEliminationMatch(this.props.tournamentId, match))
      //this.props.dispatch(updateSingleEliminationMatch(this.props.tournamentId, nextMatch));
      this.setState({brackets: this.splitMatchesToColumns});
    }

    render() {
        this.state.brackets = this.splitMatchesToColumns();
        var mappedBrackets = this.state.brackets.map((bracket, index) => {
            return <BracketColumn handicap={this.props.handicap} key={index} round={index+1} matches={bracket} updateMatch={this.updateMatch}/>
        })
        var height = this.props.matches.length * 75;
        return (
          <div className="row">
            <div className="window">
              <div></div>
              <div style={{height:height}}className="bracket-container">
                  {mappedBrackets}
              </div>
            </div>
          </div>
        )
    }

}
