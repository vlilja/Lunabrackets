import React from "react";
import Modal from "react-modal";
import phrases from "../../Phrases";
import MatchForm from "./MatchForm";

export default class GroupBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wins: [],
      modalOpen:false,
      modalContent:''
    }
    props.group.players.forEach((player, idx) => {
      this.state.wins.push({id: player.id, wins: 0});
    })
    this.createGrid = this.createGrid.bind(this);
    this.createCell = this.createCell.bind(this);
    this.openModal = this.openModal.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
  }

  updateMatch(match) {
    this.props.updateMatch(this.props.group.id, match);
  }

  createGrid() {
    var header = [];
    var rows = [];
    var cells = [];
    this.state.wins.forEach((item) => {
      item.wins = '0';
    });
    cells.push(
      <th key={'corner'}></th>
    );
    for (var k = 0; k < this.props.group.players.length; k++) {
      var name;
      if (this.props.group.players[k].nickName) {
        name = this.props.group.players[k].nickName;
      } else {
        name = this.props.group.players[k].firstName;
      }
      cells.push(
        <th key={k}>{name}</th>
      );
    }
    cells.push(
      <th key={'wins'}>{phrases.groupView.wins}</th>
    );
    header.push(
      <tr key={'headerrow'}>{cells}</tr>
    )
    for (var i = 0; i < this.props.group.players.length; i++) {
      var player = this.props.group.players[i];
      cells = [];
      cells.push(
        <td key={k}>{player.firstName + ' ' + player.lastName}
          <span class="margin-left badge">{player.handicap}</span>
        </td>
      )
      for (var k = 0; k < this.props.group.players.length + 1; k++) {
        {
          if(i === k) {
            cells.push(
              <td key={k} class="greyed-out"></td>
            )
          } else if (k === this.props.group.players.length) {
            cells.push(
              <td key={k + 'w'}>{this.state.wins[i].wins}</td>
            )
          } else {
            var cell = this.createCell(player.id, this.props.group.players[k].id);
            cells.push(cell)
          }
        }
      }
      rows.push(
        <tr key={i}>{cells}</tr>
      )
    }
    return (
      <table class="table table-striped table-hover table-bordered group-bracket">
        <thead>{header}</thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }

  createCell(playerOneId, playerTwoId) {
    var matches = this.props.group.matches
    var selectedMatch;
    var upperHalf = true;
    matches.forEach((match, idx) => {
      if (match.player_one === playerOneId && match.player_two === playerTwoId) {
        selectedMatch = match;
      }
      if (match.player_two === playerOneId && match.player_one === playerTwoId) {
        selectedMatch = match;
        upperHalf = false;
      }
    })
    var cell = <td key={selectedMatch.match_id} onClick={()=>{this.openModal(selectedMatch.match_id)}} data-match-id={selectedMatch.match_id}></td>
    if (selectedMatch.player_one_score && selectedMatch.player_two_score) {
      if (upperHalf) {
        if (selectedMatch.player_one_score > selectedMatch.player_two_score) {
          var playerWins = this.state.wins.find(function(item) {
            return item.id === playerOneId;
          })
          playerWins.wins++;
        }
        cell = <td key={selectedMatch.match_id} onClick={()=>{this.openModal(selectedMatch.match_id)}} class={playerWins
          ? 'win'
          : ''} data-match-id={selectedMatch.match_id}>{selectedMatch.player_one_score + ' – ' + selectedMatch.player_two_score}</td>
      } else {
        if (selectedMatch.player_two_score > selectedMatch.player_one_score) {
          var playerWins = this.state.wins.find(function(item) {
            return item.id === playerOneId;
          })
          playerWins.wins++;
        }
        cell = <td key={selectedMatch.match_id} onClick={()=>{this.openModal(selectedMatch.match_id)}} class={playerWins
          ? 'win'
          : ''} data-match-id={selectedMatch.match_id}>{selectedMatch.player_two_score + ' – ' + selectedMatch.player_one_score}</td>
      }
    }
    return cell;
  }

  openModal(id) {
    var match = this.props.group.matches.find((item) => {
      return id === item.match_id;
    })
    var playerOne = this.props.group.players.find((player) => {
      return match.player_one === player.id;
    })
    var playerTwo = this.props.group.players.find((player) => {
      return match.player_two === player.id;
    })
    var content = <MatchForm match={match} raceTo={this.props.raceTo} playerOne={playerOne} playerTwo={playerTwo} update={this.updateMatch} closeModal={()=>{this.setState({modalOpen:false})}} />
    this.setState({modalOpen:true, modalContent:content});
  }

  render() {
    const grid = this.createGrid();
    var elem = <div onClick={()=>{this.setState({modalOpen:false})}}>MODAL</div>
    return (
      <div>
        <h2>{this.props.group.name}</h2>{grid}
          <Modal isOpen={this.state.modalOpen} className={{
            base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal'
          }} contentLabel="Warning modal">
          {this.state.modalContent}
        </Modal>
        </div>
    )
  }

}
