import React from "react";
import {connect} from "react-redux";
import BracketColumn from "./BracketColumn";
import {getSingleEliminationMatches, fetchParticipants, updateMatch} from "../actions/tournamentActions";

@connect((store) => {
    return {tournament: store.tournament.selectedTournament, matches: store.tournament.selectedTournamentMatches, fetching: store.tournament.fetchingMatches, fetched: store.tournament.fetchedMatches, participants: store.tournament.selectedTournamentParticipants};
})

export default class Bracket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            winnerSide: [],
            loserSide: []
        }
        this.updateMatch = this.updateMatch.bind(this);
        this.splitMatchesToColumns = this.splitMatchesToColumns.bind(this);
        this.findPlayerNames = this.findPlayerNames.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchParticipants(this.props.tournament.id));
        this.props.dispatch(getSingleEliminationMatches(this.props.tournament.id));
    }

    updateMatch(match) {
        this.props.dispatch(updateMatch(match, this.props.matches));
    }

    splitMatchesToColumns() {
        var brackets = [];
        var matches = this.props.matches.winnerSide.slice();
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
        this.state.winnerSide = brackets;
    }

    findPlayerNames() {
        console.log('called');
        var players = this.props.participants;
        var matches = this.props.matches.winnerSide;
        console.log(players);
        console.log(matches);
        for (var k = 0; k < matches.length; k++) {
            var match = matches[k];
            for (var i = 0; i < players.length; i++) {
                if (match.playerOne === players[i].id) {
                    match.playerOneName = players[i].firstName + " " + players[i].lastName;
                }
                if (match.playerTwo === players[i].id) {
                    match.playerTwoName = players[i].firstName + " " + players[i].lastName;
                }
                if (match.playerOne === '99') {
                    match.playerOneName = "Walk Over";
                }
                if (match.playerTwo === '99') {
                    match.playerTwoName = "Walk Over";
                }
            }
            console.log(match);
        }
    }

    render() {
        var mappedMatches;
        if (this.props.fetched === true) {
            this.findPlayerNames();
            this.splitMatchesToColumns();
            mappedMatches = this.state.winnerSide.map((val, idx) => {
                return (<BracketColumn key={idx} round={idx + 1} matches={val} updateMatch={this.updateMatch}/>);
            })
        }

        return (
                <div className="row">
                  <div className="window">
                    <div className="bracket-container">
                        {mappedMatches}
                    </div>
                </div>
            </div>
        )

    }

}
