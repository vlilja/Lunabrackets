import React from 'react';

import Match from './Match';
import phrases from '../../Phrases';

export default class EliminationBracket extends React.Component {

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.mapRounds = this.mapRounds.bind(this);
  }

  update(match) {
    this.props.update(match);
  }

  mapRounds() {
    const { bracket } = this.props;
    let editable = false;
    if ((this.props.stage === 'qualifiers' || this.props.stage === 'finals') && this.props.user.id) {
      editable = true;
    }
    const firstRound = [];
    bracket.rounds.R1.forEach((match) => {
      firstRound.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} update={this.update} raceTo={this.props.raceTo} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const secondRound = [];
    bracket.rounds.A.forEach((match) => {
      secondRound.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} update={this.update} raceTo={this.props.raceTo} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const thirdRound = [];
    bracket.rounds.B.forEach((match) => {
      thirdRound.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} update={this.update} raceTo={this.props.raceTo} />
        </div>
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const fourthRound = [];
    bracket.rounds.C.forEach((match) => {
      fourthRound.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-double" />
        <div className="col-xs-12 match-padding-one-quarter" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} update={this.update} raceTo={this.props.raceTo} />
        </div>
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const rounds = {
      firstRound,
      secondRound,
      thirdRound,
      fourthRound,
    };
    return rounds;
  }

  render() {
    const rounds = this.mapRounds();
    return (
      <div className="col-xs-12 bracket">
        <h2>{phrases.eliminationView.bracketHeading}</h2>
        <div className="elimination-bracket">
          <div id="round firstround" className="col-lg-3 col-xs-3">
            {rounds.firstRound}
          </div>
          <div id="round secondround" className="col-lg-3 col-xs-3">
            {rounds.secondRound}
          </div>
          <div id="round thirdround" className="col-lg-3 col-xs-3">
            {rounds.thirdRound}
          </div>
          <div id="round fourthround" className="col-lg-3 col-xs-3">
            {rounds.fourthRound}
          </div>
        </div>
      </div>
    );
  }

}
