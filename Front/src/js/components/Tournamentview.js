import React from "react";
import {connect} from "react-redux";
import defaultTournament from "../classes/tournament";
import Playermanagement from "./Playermanagement";
import BracketContainer from "./BracketContainer";
import {startSingleElimination} from "../actions/tournamentActions";

@connect((store) => {
    return {tournament: store.tournament.selectedTournament, participants: store.tournament.selectedTournamentParticipants}
})

export default class Tournamentview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tournamentTypes: defaultTournament.tournamentTypes
        }
        this.showRaceTo = this.showRaceTo.bind(this);
        this.startTournament = this.startTournament.bind(this);
    }

    componentWillMount() {}

    showRaceTo() {
        console.log(this.props.tournament);
        var raceTo = this.props.tournament.raceTo;
        if (this.props.tournament.type === this.state.tournamentTypes.league) {
            return 'Race to: Round robin: ' + raceTo.roundrobin + ', Double: ' + raceTo.double + ', Single: ' + raceTo.single;
        } else if (this.props.tournament.type === this.state.tournamentTypes.doubleEliminationC) {
            return 'Race to: Double: ' + raceTo.double + ', Single: ' + raceTo.single;
        } else {
            return 'Race to: ' + raceTo.single;
        }

    }

    startTournament() {
        if (this.props.tournament.type === 'Single') {
            this.props.dispatch(startSingleElimination(this.props.tournament, this.props.participants));
        }
    }

    render() {
        const tournament = this.props.tournament;
        return (
            <div className="container">
                <div className="row" style={{
                    maxHeight: '600px'
                }}>
                    <div className="col-md-4">
                        <h2>{tournament.name}</h2>
                        <p>
                            <label>Type: {tournament.type}</label><br/>
                            <label>Size: {tournament.size}
                                players</label><br/>
                            <label>Game: {tournament.gameType}</label><br/>
                            <label>Handicap enabled: {tournament.handicap
                                    ? 'Yes'
                                    : 'No'}</label><br/>
                            <label>{this.showRaceTo()}</label><br/>
                            <label>Status: {tournament.status}</label>
                        </p>
                        <div>
                            {tournament.status === 'signup'
                                ? (
                                    <button onClick={this.startTournament}>Start tournament</button>
                                )
                                : ''}
                        </div>
                    </div>
                    {tournament.status === 'signup'
                        ? (
                            <div className="col-md-8">
                                <Playermanagement tournamentId={tournament.id} tournamentSize={tournament.size}/>
                            </div>
                        )
                        : ''}
                    {tournament.status === 'started'
                        ? (<BracketContainer tournamentId={tournament.id}/>)
                        : ''
}

                </div>

            </div>
        )
    }

}
