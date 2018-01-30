import React from 'react';

import Modal from './Modal';
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
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ modalOpen: false });
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
          match={match}
          player={player}
          update={this.props.update}
          closeModal={this.closeModal}
        />);
      }
      this.setState({ modalOpen: open, modalContent: content });
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div>
        <div className="clickable" onClick={this.openModal} role="button" tabIndex={0}>
          <div className="margin-bottom">
            <span className="badge badge-dark">{match.key}</span>
            <span style={{
            float: 'right',
          }}
            >{this.props.loserside}</span>
          </div>
          <div
            className={match.playerOne.score === this.props.raceTo ||
              (match.walkOver === 1 && match.playerOne.details)
          ? 'matchtag winner'
          : 'matchtag'}
            style={{
          borderBottom: '1px solid black',
        }}
          ><div className="nametag">
            <div className="name">{match.playerOne.details
            ? (`${match.playerOne.details.firstName} ${match.playerOne.details.lastName}`)
            : ''} {match.walkOver === 1 && !match.playerOne.details
            ? 'Walk over'
            : ''}
            </div>
            <div className="score">{match.playerOne.score}</div>
          </div>
          </div>
          <div className={match.playerTwo.score === this.props.raceTo ||
              (match.walkOver === 1 && match.playerTwo.details)
          ? 'matchtag winner'
          : 'matchtag'}
          ><div className="nametag">
            <div className="name">{match.playerTwo.details
            ? `${match.playerTwo.details.firstName} ${match.playerTwo.details.lastName}`
            : ''} {match.walkOver === 1 && !match.playerTwo.details
            ? 'Walk over'
            : ''}
            </div>
            <div className="score">{match.playerTwo.score}</div>
          </div>
          </div>
        </div>
        <Modal
          open={this.state.modalOpen}
          classes={['col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal']}
          bgclasses={['modal-back-ground']}
        >
          {this.state.modalContent}
        </Modal>

      </div>
    );
  }

}
