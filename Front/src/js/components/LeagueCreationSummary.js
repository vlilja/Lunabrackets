import React from "react";
import _ from "lodash";
import phrases from "../../Phrases";
import Modal from "react-modal";

export default class LeagueCreationSummary extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
      modalStyles: {
        content: {
          maxHeight: '220px',
          minHeight: '200px',
          minWidth: '400px',
          maxWidth: '600px',
          top: '35%',
          left: '35%',
          right: '35%',
          bottom: '35%',
          overflow: 'hidden'
        }
      }
    }
    this.showGameName = this.showGameName.bind(this);
    this.controlModal = this.controlModal.bind(this);
    this.createLeague = this.createLeague.bind(this);
    this.finish = this.finish.bind(this);
  }

  showGameName(value) {
    switch (value) {
      case '1':
        return phrases.general.games.eight
      case '2':
        return phrases.general.games.nine
      case '3':
        return phrases.general.games.ten
      case '4':
        return phrases.general.games.straight
    }
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
    this.setState({modalOpen: bool});
  }

  render() {
    const summary = this.props.summary;
    const pickedPlayers = this.props.summary.participants.map((player, idx) => {
      return <li key={idx} class="list-group-item">{player.firstName} {player.lastName}
        <span style={{
          float: 'right'
        }}>{phrases.general.handicap}{': '}
          <span class="badge" style={{
            backgroundColor: 'grey'
          }}>{player.handicap}</span>
        </span>
      </li>
    })
    return (
      <div className="col-lg-8 col-lg-offset-1 col-sm-12">
        <div class="well bs-component">
          <div class="form-horizontal">
            <fieldset>
              <legend>{phrases.leagueForm.summaryHeading}</legend>
              <div class="form-group">
                <div class="col-xs-12">
                  <h4>{phrases.leagueForm.name}{': '}{summary.name}</h4>
                  <h4>{phrases.leagueForm.game}{': '}{this.showGameName(summary.game)}</h4>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <label style={{
                    fontSize: '1.1em'
                  }}>{phrases.leagueForm.selectedPlayers}{' '}{pickedPlayers.length}{' / 32'}</label>
                  <ul class="list-group scrollable">
                    {pickedPlayers}
                  </ul>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <div class="col-xs-6">
                    <button class="btn btn-primary" onClick={this.props.back}>Back</button>
                  </div>
                  <div class="col-xs-6 text-right">
                    <button class="btn btn-primary" onClick={this.finish}>Finish</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <Modal isOpen={this.state.modalOpen} className={{
          base: 'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal'
        }} contentLabel="Warning modal">
          <div>
            <div class="col-xs-12">
              <h2>{phrases.leagueForm.warningHeading}</h2>
              <p style={{
                fontSize: '1.1em'
              }}>{phrases.leagueForm.warningMessage}</p>
            </div>
            <div class="col-xs-12 margin-top">
              <div class="col-xs-6">
                <button class="btn btn-default" onClick={() => {
                  this.controlModal(false)
                }}>{phrases.general.no}</button>
              </div>
              <div class="col-xs-6 text-right">
                <button class="btn btn-primary" onClick={this.createLeague} style={{
                  float: 'right'
                }}>{phrases.general.yes}</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
