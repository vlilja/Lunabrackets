import React from "react";
import Modal from "react-modal";
import MatchForm from "./MatchForm";
import WalkOverForm from "./WalkOverForm";

export default class Match extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalContent: null
    }
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    var match = this.props.match;
    var content;
    var open = true;
    if (match.playerOne.details && match.playerTwo.details) {
      content = <MatchForm match={match} raceTo={this.props.raceTo} update={this.props.update} closeModal={() => {
        this.setState({modalOpen: false})
      }}/>
    } else if (!match.playerOne.details && !match.playerTwo.details) {
      open = false;
    } else {
      var player;
      if (match.playerOne.details) {
        player = match.playerOne.details;
      } else {
        player = match.playerTwo.details;
      }
      content = <WalkOverForm player={player} update={() => {}} closeModal={() => {
        this.setState({modalOpen: false})
      }}/>
    }
    this.setState({modalOpen: open, modalContent: content});
  }

  render() {
    const match = this.props.match;
    console.log(this.props.match);
    return (
      <div onClick={this.openModal}>
        <div class="margin-bottom">
          <span class="badge badge-dark">{match.key}</span>
          <span style={{
            float: 'right'
          }}>{this.props.loserside}</span>
        </div>
        <div class={match.playerOne.score === this.props.raceTo
          ? "winner"
          : ''} style={{
          borderBottom: '1px solid black'
        }}>{match.playerOne.details
            ? (match.playerOne.details.firstName + ' ' + match.playerOne.details.lastName)
            : ''}
            {match.walkOver === "1" && !match.playerOne.details ? 'Walk over' : ''}
          <span style={{
            float: 'right'
          }}>{match.playerOne.score}</span>
        </div>
        <div class={match.playerTwo.score === this.props.raceTo
          ? "winner"
          : ''}>{match.playerTwo.details
            ? match.playerTwo.details.firstName + ' ' + match.playerTwo.details.lastName
            : ''}
            {match.walkOver === "1" && !match.playerTwo.details ? 'Walk over' : ''}
          <span style={{
            float: 'right'
          }}>{match.playerTwo.score}</span>
        </div>
        <Modal isOpen={this.state.modalOpen} className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal'
        }} contentLabel="Warning modal">
          {this.state.modalContent}
        </Modal>
      </div>
    )
  }

}
