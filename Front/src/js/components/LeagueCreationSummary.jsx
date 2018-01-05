import React from 'react';
import Modal from 'react-modal';

import phrases from '../../Phrases';
import helper from '../helpers/helper';

export default class LeagueCreationSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.controlModal = this.controlModal.bind(this);
    this.createLeague = this.createLeague.bind(this);
    this.finish = this.finish.bind(this);
  }

  finish() {
    if (this.props.summary.participants.length < 32) {
      this.controlModal(true);
    } else {
      this.props.createLeague();
    }
  }

  createLeague() {
    this.controlModal(false);
    this.props.createLeague();
  }

  controlModal(bool) {
    this.setState({ modalOpen: bool });
  }

  render() {
    const { summary } = this.props;
    const pickedPlayers = summary.participants.map(player => (<li key={player.id} className="list-group-item">{player.firstName} {player.lastName}
      <span style={{
          float: 'right',
        }}
      >{phrases.general.handicap}{': '}
        <span
          className="badge"
          style={{
            backgroundColor: 'grey',
          }}
        >{player.handicap}</span>
      </span>
    </li>));
    return (
      <div className="col-lg-8 col-lg-offset-1 col-sm-12">
        <div className="well bs-component">
          <div className="form-horizontal">
            <fieldset>
              <legend>{phrases.leagueForm.summaryHeading}</legend>
              <div className="form-group">
                <div className="col-xs-12">
                  <h4>{phrases.leagueForm.name}{': '}{summary.name}</h4>
                  <h4>{phrases.leagueForm.game}{': '}{helper.determineGameName(summary.game)}</h4>
                </div>
              </div>
              <div className="form-group">
                <div className="col-xs-12">
                  <span style={{
                    fontSize: '1.1em',
                  }}
                  >{phrases.leagueForm.selectedPlayers}{' '}{pickedPlayers.length}{' / 32'}</span>
                  <ul className="list-group scrollable">
                    {pickedPlayers}
                  </ul>
                </div>
              </div>
              <div className="form-group">
                <div className="col-xs-12">
                  <div className="col-xs-6">
                    <button className="btn btn-primary" onClick={this.props.back}>Back</button>
                  </div>
                  <div className="col-xs-6 text-right">
                    <button className="btn btn-primary" onClick={this.finish}>Finish</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalOpen}
          className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal',
        }}
          contentLabel="Warning modal"
        >
          <div>
            <div className="col-xs-12">
              <h2>{phrases.leagueForm.warningHeading}</h2>
              <p style={{
                fontSize: '1.1em',
              }}
              >{phrases.leagueForm.warningMessage}</p>
            </div>
            <div className="col-xs-12 margin-top">
              <div className="col-xs-6">
                <button
                  className="btn btn-default"
                  onClick={() => {
                  this.controlModal(false);
                }}
                >{phrases.general.no}</button>
              </div>
              <div className="col-xs-6 text-right">
                <button
                  className="btn btn-primary"
                  onClick={this.createLeague}
                  style={{
                  float: 'right',
                }}
                >{phrases.general.yes}</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
