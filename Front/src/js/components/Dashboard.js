import React from "react";
import {connect} from "react-redux";
import {fetchTournaments, selectTournament, getHelloWorld} from "../actions/tournamentActions";
import Statusbar from "./Statusbar.js";
import view from "../actions/viewActions";
require("../../stylesheets/dashboard.scss");

@connect((store) => {
    return {tournaments: store.tournament.tournaments, tournamentFetching: store.tournament.fetching, tournamentFetched: store.tournament.fetched}
})

export default class Dashboard extends React.Component {

    constructor() {
        super();
        this.openTournamentView = this.openTournamentView.bind(this);
    }

    getLevel(value) {
      if(value === 'signup'){
        return 1;
      }
      else if (value === 'started'){
        return 2;
      }
      else {
        return 3;
      }
    }

    componentWillMount() {
        this.props.dispatch(fetchTournaments());
    }

    openTournamentView(searchId) {
        console.log(searchId);
        this.props.tournaments.forEach((tournament) => {
          if(tournament.id === searchId){
            console.log(tournament);
            this.props.dispatch(selectTournament(tournament));
          }
        });
    }

    render() {
        const {tournaments, tournamentFetching, tournamentFetched} = this.props;
        if (tournaments.length && tournamentFetched) {
            const mappedTournaments = tournaments.map((tournament) =><li key={tournament.id} value={tournament.id} onClick={() => {this.openTournamentView(tournament.id)}} className="inline-block"><div className="lunaux-selectable-box" >
                <h3>{tournament.name}</h3>
                <p>Tournament type: {tournament.type}</p>
                <p>Game: {tournament.gameType}</p>
                <div><strong>Status: </strong><div className="inline-block" style={{width:'70%'}}><Statusbar text={tournament.status} level={this.getLevel(tournament.status)} /></div></div>
            </div></li>)
            return (
                <div>
                    <h2>Tounaments</h2>
                    <ul>
                        {mappedTournaments}
                    </ul>
                </div>
            )
        }
        return (
            <div>There are no tournaments, maybe create one?</div>

        )

    }

}
