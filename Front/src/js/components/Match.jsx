import React from 'react';
import Modal from 'react-modal';
import MatchForm from './MatchForm';
import WalkOverForm from './WalkOverForm';

export default class Match extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalContent: null,
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    if (this.props.editable) {
      const { match } = this.props;
      let content;
      let open = true;
      if (match.playerOne.details && match.playerTwo.details) {
        content = (<MatchForm
          match={match}
          raceTo={this.props.raceTo}
          update={this.props.update}
          closeModal={() => {
          this.setState({ modalOpen: false });
        }}
        />);
      } else if (!match.playerOne.details && !match.playerTwo.details) {
        open = false;
      } else {
        let player;
        if (match.playerOne.details) {
          player = match.playerOne.details;
        } else {
          player = match.playerTwo.details;
        }
        content = (<WalkOverForm
          player={player}
          update={() => {}}
          closeModal={() => {
          this.setState({ modalOpen: false });
        }}
        />);
      }
      this.setState({ modalOpen: open, modalContent: content });
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div className="clickable" onClick={this.openModal} role="button" tabIndex={0}>
        <div className="margin-bottom">
          <span className="badge badge-dark">{match.key}</span>
          <span style={{
            float: 'right',
          }}
          >{this.props.loserside}</span>
        </div>
        <div
          className={match.playerOne.score === this.props.raceTo
          ? 'winner'
          : ''}
          style={{
          borderBottom: '1px solid black',
        }}
        >{match.playerOne.details
            ? (`${match.playerOne.details.firstName} ${match.playerOne.details.lastName}`)
            : ''} {match.walkOver === '1' && !match.playerOne.details
            ? 'Walk over'
            : ''}
          <span style={{
            float: 'right',
          }}
          >{match.playerOne.score}</span>
        </div>
        <div className={match.playerTwo.score === this.props.raceTo
          ? 'winner'
          : ''}
        >{match.playerTwo.details
            ? `${match.playerTwo.details.firstName} ${match.playerTwo.details.lastName}`
            : ''} {match.walkOver === '1' && !match.playerTwo.details
            ? 'Walk over'
            : ''}
          <span style={{
            float: 'right',
          }}
          >{match.playerTwo.score}</span>
        </div>
        <Modal
          isOpen={this.state.modalOpen}
          className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal',
        }}
          overlayClassName={{
          base: 'modal-back-ground',
        }}
          contentLabel="Warning modal"
        >
          {this.state.modalContent}
        </Modal>
      </div>
    );
  }

}
