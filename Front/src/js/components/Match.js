import React from "react";
import Modal from "react-modal";
import MatchForm from "./MatchForm";

export default class Match extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalContent:null
    }
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    var match = this.props.match;
    var content;
    if(match.player_one && match.player_two){
      content = <MatchForm match={match} raceTo={this.props.raceTo} playerOne={match.player_one} playerTwo={match.player_two} update={this.props.update} closeModal={() => {
        this.setState({modalOpen: false})
      }}/>
    }
    else {
      content = <div>Walk over? <i class="fa fa-window-close" style={{
        fontSize: '30px'
      }} aria-hidden="true" onClick={() => {
        this.setState({modalOpen: false})
      }}></i></div>
    }
    this.setState({modalOpen: true, modalContent:content});
  }

  render() {
    const match = this.props.match;
    return (
      <div onClick={this.openModal}>
        <div class="margin-bottom">
          <span class="badge badge-dark">{match.match_key}</span>
          <span style={{
            float: 'right'
          }}>{this.props.loserside}</span>
        </div>
        <div style={{
          borderBottom: '1px solid black'
        }}>{match.player_one
            ? (match.player_one.firstName + ' ' + match.player_one.lastName)
            : ''}
          <span style={{
            float: 'right'
          }}>{match.player_one_score}</span>
        </div>
        <div>{match.player_two
            ? match.player_two.firstName + ' ' + match.player_two.lastName
            : ''}
          <span style={{
            float: 'right'
          }}>{match.player_two_score}</span>
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
