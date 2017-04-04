import React from "react";
import {connect} from "react-redux";
import Tournamentsettings from "./Tournamentsettings";
import defaultTournament from "../classes/tournament";
import Modal from "react-modal";
import view from "../actions/viewActions";
require('../../stylesheets/tournamentform.scss');
require('../../stylesheets/modal.scss');

@connect((store) => {
    return {};
})

export default class Tournamentform extends React.Component {

    constructor() {
        super();
        this.state = {
            tournament: defaultTournament.tournament,
            gametypes: defaultTournament.gametypes,
            tournamentTypes: defaultTournament.tournamentTypes,
            modalOpen: false
        };
        this.editTournamentSettings = this.editTournamentSettings.bind(this);
        this.editCupSize = this.editCupSize.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.showRaceTo = this.showRaceTo.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        console.log("Target: " + target + "Value: " + value + "Name :" + name);
        var tournament = this.state.tournament;
        tournament = {
            ...tournament,
            [name]: value
        };
        if (name === 'size') {
            tournament = {
                ...tournament,
                cupSize: '4'
            };
        }
        this.setState({tournament: tournament});
    }

    editCupSize(cupSize) {
        var tournament = this.state.tournament;
        tournament = {
            ...tournament,
            cupSize: cupSize
        };
        this.setState({tournament: tournament});
    }

    editTournamentSettings(raceto) {
        var tournament = this.state.tournament;
        tournament = {
            ...tournament,
            raceto: raceto
        };
        this.setState({tournament: tournament});
    }

    handleOpenModal() {
        this.setState({modalOpen: true});
    }

    handleCloseModal() {
        this.setState({modalOpen: false});
    }

    showRaceTo() {
        var raceto = this.state.tournament.raceto;
        if (this.state.tournament.type === this.state.tournamentTypes.league) {
            return 'Race to: Round robin: ' + raceto.roundrobin + ', Double: ' + raceto.double + ', Single: ' + raceto.single;
        } else if (this.state.tournament.type === this.state.tournamentTypes.doubleEliminationC) {
            return 'Race to: Double: ' + raceto.double + ', Single: ' + raceto.single;
        } else {
            return 'Race to: ' + raceto.single;
        }

    }

    submitForm() {
      this.handleCloseModal();
      this.props.dispatch(view.showHomeScreen());
    }

    render() {
        console.log(this.state);
        return (
            <div id="tournament-form">
                <h3>
                    <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                    Create new tournament</h3>
                <label>Name</label>
                <input name="name" onChange={this.handleInputChange} type="text"></input>
                <label>Handicap
                </label>
                <span><input type="checkbox" checked={this.state.handicap} name="handicap" onChange={this.handleInputChange}/></span>
                <br/>
                <label>Game type</label>
                <div className="options">
                    <label><input type="radio" value={'8-ball'} checked={this.state.tournament.gametype === this.state.gametypes.eightball} name="gametype" onChange={this.handleInputChange}/>
                        8-ball
                    </label>
                    <label><input type="radio" value={'9-ball'} checked={this.state.tournament.gametype === this.state.gametypes.nineball} name="gametype" onChange={this.handleInputChange}/>
                        9-ball
                    </label>
                    <label><input type="radio" value={'10-ball'} checked={this.state.tournament.gametype === this.state.gametypes.tenball} name="gametype" onChange={this.handleInputChange}/>
                        10-ball
                    </label>
                    <label><input type="radio" value={'Straight'} checked={this.state.tournament.gametype === this.state.gametypes.straight} name="gametype" onChange={this.handleInputChange}/>
                        Straight pool
                    </label>
                </div>
                <label>Tournament size</label>
                <div className="options">
                    <label><input type="radio" value={8} name="size" checked={this.state.tournament.size === '8'} onChange={this.handleInputChange}/>
                        8 players
                    </label>
                    <label><input type="radio" value={16} name="size" checked={this.state.tournament.size === '16'} onChange={this.handleInputChange}/>
                        16 players
                    </label>
                    <label><input type="radio" value={32} name="size" checked={this.state.tournament.size === '32'} onChange={this.handleInputChange}/>
                        32 players
                    </label>
                    <label><input type="radio" value={64} name="size" checked={this.state.tournament.size === '64'} onChange={this.handleInputChange}/>
                        64 players
                    </label>
                    <label><input type="radio" value={128} name="size" checked={this.state.tournament.size === '128'} onChange={this.handleInputChange}/>
                        128 players
                    </label>
                </div>
                <label>Tournament type</label>
                <div className="options">
                    <label><input type="radio" value={'League'} name="type" checked={this.state.tournament.type === this.state.tournamentTypes.league} onChange={this.handleInputChange}/>
                        League</label>
                    <label><input type="radio" value={'DoubleWithCup'} name="type" checked={this.state.tournament.type === this.state.tournamentTypes.doubleEliminationC} onChange={this.handleInputChange}/>
                        Double-Elimination with cup</label>
                    <label><input type="radio" value={'DoubleWithoutCup'} name="type" checked={this.state.tournament.type === this.state.tournamentTypes.doubleElimination} onChange={this.handleInputChange}/>
                        Double-Elimination without cup</label>
                    <label><input type="radio" value={'Single'} name="type" checked={this.state.tournament.type === this.state.tournamentTypes.single} onChange={this.handleInputChange}/>
                        Single-elimination</label><br/>
                </div>
                <label>Tournament settings</label>
                <Tournamentsettings tournamentType={this.state.tournament.type} tournamentSize={this.state.tournament.size} cupSize={this.state.tournament.cupSize} raceto={this.state.tournament.raceto} setCupSize={this.editCupSize} setRaceTo={this.editTournamentSettings}/><br/>
                <button className="lunaux-btn lunaux-margin-bottom-double" onClick={this.handleOpenModal}>Create tournament</button>
                <Modal isOpen={this.state.modalOpen} className="lunaux-modal" overlayClassName="lunaux-overlay" contentLabel="testing this modal stuff">
                    <h1>Create tournament with these specs?</h1>
                    <p>
                        <label>Name: {this.state.tournament.name}</label><br/>
                        <label>Type: {this.state.tournament.type}</label><br/>
                        <label>Size: {this.state.tournament.size}
                            players</label><br/>
                        <label>Game: {this.state.tournament.gametype}</label><br/>
                        <label>Handicap enabled: {this.state.tournament.handicap
                                ? 'Yes'
                                : 'No'}</label><br/>
                        <label>{this.showRaceTo()}</label><br/>
                        <label>{(this.state.tournament.type === this.state.tournamentTypes.league || this.state.tournament.type === this.state.tournamentTypes.doubleEliminationC)
                                ? 'Cup: ' + this.state.tournament.cupSize + ' players'
                                : ''}</label>
                    </p>

                    <button className="lunaux-btn" onClick={this.submitForm}>Yes</button>
                    <button className="lunaux-btn" onClick={this.handleCloseModal}>No</button>
                </Modal>
            </div>
        )
    }
}
