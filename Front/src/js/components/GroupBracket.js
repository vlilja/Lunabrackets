import React from "react";
import Modal from "react-modal";
import phrases from "../../Phrases";
import MatchForm from "./MatchForm";

export default class GroupBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalContent: '',
      sortByWins: false,
      sortByPlace: false
    }
    this.drawBracket = this.drawBracket.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
    this.openModal = this.openModal.bind(this);
    this.sortPlayers = this.sortPlayers.bind(this);
  }

  updateMatch(match) {
    this.props.updateMatch(this.props.group.id, match);
  }

  openModal(matchId) {
    if (this.props.stage === 'group') {
      var match = this.props.bracket.matches.find((match) => {
        return matchId === match.id;
      })
      var content = <MatchForm match={match} raceTo={this.props.raceTo} update={this.updateMatch} closeModal={() => {
        this.setState({modalOpen: false})
      }}/>
      this.setState({modalOpen: true, modalContent: content});
    }
  }

  sortPlayers(rule) {
    var players = this.props.bracket.players;
    var order = [];
    if (rule === "place") {
      players.sort((a, b) => {
        return a[rule] - b[rule]
      });
      players.forEach((player) => {
        order.push(player.id)
      });
    }
    if (rule === 'wins') {
      var scores = [];
      for (var key in this.props.bracket.scores) {
        scores.push({playerId: key, score: this.props.bracket.scores[key]});
      }
      scores.sort((a, b) => {
        return b.score - a.score;
      })
      scores.forEach((player) => {
        order.push(player.playerId);
      })
    }
    this.props.bracket.sortRows(order);
    if (rule === 'wins') {
      this.setState({sortByWins: true, sortByPlace: false});
    }
    if (rule === 'place') {
      this.setState({sortByWins: false, sortByPlace: true});
    }
  }

  drawBracket() {
    //Table header
    var headerCells = [];
    headerCells.push(
      <th key={'corner'}></th>
    );
    this.props.bracket.players.forEach((player, idx) => {
      var name = player.nickName
        ? player.nickName
        : player.firstName;
      headerCells.push(
        <th key={idx}>{name}</th>
      );
    })
    headerCells.push(
      <th key={'wins'} onClick={() => {
        this.sortPlayers('wins')
      }}>{phrases.groupView.wins}
        <span class="right">
          <i class={this.state.sortByWins
            ? "fa fa-angle-down"
            : "fa fa-angle-right"} aria-hidden="true"></i>
        </span>
      </th>
    );
    if (this.props.stage !== 'group') {
      headerCells.push(
        <th key={'place'} onClick={() => {
          this.sortPlayers('place')
        }}>{phrases.groupView.place}
          <span class="right">
            <i class={this.state.sortByPlace
              ? "fa fa-angle-down"
              : "fa fa-angle-right"} aria-hidden="true"></i>
          </span>
        </th>
      )
    }
    //Table rows
    var rows = [];
    this.props.bracket.grid.forEach((row, idx) => {
      var cells = [];
      var player = this.props.bracket.players.find((player) => {
        return player.id === row[0].pOne;
      })
      cells.push(
        <td key={'name'}>{player.firstName + ' ' + player.lastName}</td>
      );
      row.forEach((match, idx) => {
        if (!match.match) {
          cells.push(
            <td key={idx} class="greyed-out"></td>
          )
        } else {
          var score;
          var result = match.match.getResult();
          if (result) {
            var win = result.winner === match.pOne
              ? 'win'
              : '';
            if (match.pOne === match.match.playerOne.id) {
              score = match.match.playerOne.score + phrases.general.ndash + match.match.playerTwo.score;
            } else {
              score = match.match.playerTwo.score + phrases.general.ndash + match.match.playerOne.score;
            }
          }
          cells.push(
            <td class={win} key={idx} onClick={() => {
              this.openModal(match.match.id)
            }}>{score}</td>
          )
        }
      })
      cells.push(
        <td key={'wins'}>{this.props.bracket.scores[player.id]}</td>
      )
      if (this.props.stage !== 'group') {
        cells.push(
          <td key={'place'}>{player.place}</td>
        )
      }
      rows.push(
        <tr key={idx}>{cells}</tr>
      );
    })
    return {header: headerCells, body: rows};
  }

  render() {
    var table = this.drawBracket();
    return (
      <div>
        <h2>{this.props.group.name + ' (' + this.props.group.key + ')'}</h2>
        <table class="table table-striped table-hover table-bordered group-bracket">
          <thead>
            <tr>{table.header}</tr>
          </thead>
          <tbody>
            {table.body}
          </tbody>
        </table>
        <Modal isOpen={this.state.modalOpen} className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal'
        }} overlayClassName={{
          base: 'modal-back-ground'
        }} contentLabel="Warning modal">
          {this.state.modalContent}
        </Modal>
      </div>
    )

  }

}
