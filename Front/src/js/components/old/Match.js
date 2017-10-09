import React from "react";
import {connect} from "react-redux";
import Player from "../classes/player";
import Modal from "react-modal";

export default class Match extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playerOne: {},
            playerTwo: {},
            playerOneScore: 0,
            playerTwoScore: 0,
            modalOpen: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.updateMatch = this.updateMatch.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        var player;
        if (name === 'playerOneScore') {
            this.setState({playerOneScore: target.value});
        } else if (name === 'playerTwoScore') {
            this.setState({playerTwoScore: target.value});
        }
    }

    handleOpenModal() {
        this.setState({modalOpen: true});
    }

    handleCloseModal() {
        this.setState({modalOpen: false});
    }

    findPlayerNames() {
        var players = this.props.players;
        var match = this.props.match;
        for (var i = 0; i < players.length; i++) {
            if (match.playerOne === players[i].id) {
                this.state.playerOne = players[i];
            }
            if (match.playerTwo === players[i].id) {
                this.state.playerTwo = players[i];
            }
        }
        if (match.playerOne === '99') {
            this.state.playerOne = new Player(99, 'Walk', 'Over');
        }
        if (match.playerTwo === '99') {
            this.state.playerTwo = new Player(99, 'Walk', 'Over');
        }
    }

    updateMatch() {
        this.props.match.setPlayerOneScore(this.state.playerOneScore);
        this.props.match.setPlayerTwoScore(this.state.playerTwoScore);
        this.props.updateMatch(this.props.match);
        this.handleCloseModal();
    }

    render() {
        var match = this.props.match;
        var {handicap} = this.props;
        var {playerOne, playerTwo} = this.props.match;
        var {playerOneScore, playerTwoScore} = this.props.match;
        return (
            <div>
                <div>
                    {playerOne && playerTwo && match.complete !== 'Y'
                        ? <Modal isOpen={this.state.modalOpen} className="lunaux-modal" overlayClassName="lunaux-overlay" contentLabel="testing this modal stuff">
                                <h1>Enter match result</h1>
                                <div>
                                    <label>{match.playerOneName}
                                    </label>
                                    <input style={{
                                        margin: '2px'
                                    }} min={handicap === 'Y'
                                        ? playerOne.handicap
                                        : '0'} max={match.raceTo} type='number' name='playerOneScore' onChange={this.handleInputChange} value={this.state.playerOneScore}></input>
                                    -
                                    <input style={{
                                        margin: '2px'
                                    }} min={handicap === 'Y'
                                        ? playerTwo.handicap
                                        : '0'} max={match.raceTo} type='number' name='playerTwoScore' onChange={this.handleInputChange} value={this.state.playerTwoScore}></input>
                                    <label>
                                        {match.playerTwoName}</label>
                                </div><br/>
                                <button className="lunaux-btn" onClick={this.updateMatch}>Submit result</button>
                                <button className="lunaux-btn" onClick={this.handleCloseModal}>Cancel</button>
                            </Modal>
                        : ''
}
                </div>
                <div className={match.complete !== 'Y' ? "match" : "match complete"} onClick={this.handleOpenModal}>
                    <span className="number">{match.number}</span>
                    <div className="first">
                        <p>{match.playerOneName} {match.playerOneScore === match.raceTo
                                ? <span className="badge score winner">{match.playerOneScore}</span>
                                : <span className="badge score">{match.playerOneScore}</span>}</p>
                    </div>
                    <div>
                        <p>{match.playerTwoName}
                          {match.playerTwoScore === match.raceTo
                                  ? <span className="badge score winner">{match.playerTwoScore}</span>
                                  : <span className="badge score">{match.playerTwoScore}</span>}</p>
                    </div>
                </div>
            </div>
        )
    }
}
