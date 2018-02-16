import React from 'react';

import Match from './Match';
import phrases from '../../Phrases';

export default class FinalsBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.mapRounds = this.mapRounds.bind(this);
  }

  mapRounds() {
    const { bracket } = this.props;
    let editable = false;
    if (this.props.stage === 'finals' && this.props.user.id) {
      editable = true;
    }
    const firstRound = [];
    bracket.rounds.R1.forEach((match) => {
      firstRound.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const secondRound = [];
    bracket.rounds.A.forEach((match) => {
      secondRound.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="col-xs-12 match-padding-half" />
      </div>);
    });
    const thirdRound = [];
    bracket.rounds.B.forEach((match) => {
      thirdRound.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-double" />
        <div className="col-xs-12 match-padding-one-quarter" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="col-xs-12 match-padding-double" />
        <div className="col-xs-12 match-padding-three-quarters" />
      </div>);
    });
    const rounds = {
      firstRound,
      secondRound,
      thirdRound,
    };
    return rounds;
  }

  render() {
    const rounds = this.mapRounds();
    return (
      <div className="col-xs-12 bracket">
        <h2>{phrases.finalsView.bracketHeading}</h2>
        <div className="finals-bracket">
          <div id="round firstround" className="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center',
            }}
            >{phrases.finalsView.quarterFinals}</h3>
            {rounds.firstRound}
          </div>
          <div id="round secondround" className="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center',
            }}
            >{phrases.finalsView.semiFinals}</h3>
            {rounds.secondRound}
          </div>
          <div id="round thirdround" className="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center',
            }}
            >{phrases.finalsView.final}</h3>
            {rounds.thirdRound}
          </div>
        </div>
      </div>
    );
  }

}
