import React from 'react';

import Match from './Match';
import Icons from './Icons';
import phrases from '../../Phrases';

export default class QualifiersBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      winnerSideVisible: true,
      loserSideVisible: true,
    };
    this.toggleWinnerSide = this.toggleWinnerSide.bind(this);
    this.toggleLoserSide = this.toggleLoserSide.bind(this);
    this.mapRounds = this.mapRounds.bind(this);
  }

  toggleWinnerSide() {
    const bool = !this.state.winnerSideVisible;
    this.setState({ winnerSideVisible: bool });
  }

  toggleLoserSide() {
    const bool = !this.state.loserSideVisible;
    this.setState({ loserSideVisible: bool });
  }

  mapRounds() {
    let editable = false;
    if (this.props.stage === 'qualifiers') {
      editable = true;
    }
    const firstRound = [];
    const { bracket } = this.props;
    bracket.upperBracket.R1.matches.forEach((match) => {
      firstRound.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const secondRound = [];
    bracket.upperBracket.A.matches.forEach((match) => {
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
    bracket.upperBracket.B.matches.forEach((match) => {
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
    const loserFirst = [];
    bracket.lowerBracket.L1.matches.forEach((match) => {
      loserFirst.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const loserSecond = [];
    bracket.lowerBracket.L2.matches.forEach((match, idx) => {
      loserSecond.push(<div key={match.id} className="col-xs-12">
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} loserside={bracket.lowerBracket.L2.playersFrom + String(bracket.lowerBracket.L2.matches.length - idx)} update={this.props.update} />
        </div>
        <div className="match-padding-half col-xs-12" />
      </div>);
    });
    const loserThird = [];
    bracket.lowerBracket.L3.matches.forEach((match) => {
      loserThird.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} update={this.props.update} />
        </div>
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="col-xs-12 match-padding-half" />
      </div>);
    });
    const loserFourth = [];
    bracket.lowerBracket.L4.matches.forEach((match, idx) => {
      loserFourth.push(<div key={match.id} className="col-xs-12">
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="panel match col-xs-12">
          <Match match={match} editable={editable} raceTo={this.props.raceTo} loserside={bracket.lowerBracket.L4.playersFrom + String(1 + idx)} update={this.props.update} />
        </div>
        <div className="col-xs-12 match-padding-three-quarters" />
        <div className="col-xs-12 match-padding-half" />
      </div>);
    });
    const rounds = {
      firstRound,
      secondRound,
      thirdRound,
      loserFirst,
      loserSecond,
      loserThird,
      loserFourth,
    };
    return rounds;
  }

  render() {
    let bracket;
    if (this.props.matches) {
      const rounds = this.mapRounds();
      bracket = (<div className="bracket col-xs-12">
        <div className="qualifiers-bracket">
          <div id="winnerside">
            <div onClick={this.toggleWinnerSide} role="presentation"><h2 className="clickable" >{phrases.qualifiersView.winnerSide}
              <span className="margin-left"><Icons
                type={this.state.winnerSideVisible
                ? 'ARROW-DOWN'
                : 'ARROW-RIGHT'}
                inline
                color="black"
                size="32px"
              />
              </span></h2>
            </div>
            <div
              className="winnerside row"
              style={{
              display: (this.state.winnerSideVisible
                ? 'block'
                : 'none'),
            }}
            >
              <div id="first-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >R1</h3>
                {rounds.firstRound}
              </div>
              <div id="second-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >W1</h3>
                {rounds.secondRound}
              </div>
              <div id="third-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >W2</h3>
                {rounds.thirdRound}
              </div>
            </div>
          </div>
          <div id="loserside">
            <div onClick={this.toggleLoserSide} role="presentation" >
              <h2 className="clickable" >{phrases.qualifiersView.loserSide}
                <span className="margin-left"><Icons
                  type={this.state.loserSideVisible
                ? 'ARROW-DOWN'
                : 'ARROW-RIGHT'}
                  inline
                  color="black"
                  size="32px"
                /></span></h2>
            </div>
            <div
              className="loserside row"
              style={{
              display: (this.state.loserSideVisible
                ? 'block'
                : 'none'),
            }}
            >
              <div id="loserside-first-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >L1</h3>
                {rounds.loserFirst}
              </div>
              <div id="loserside-second-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >L2</h3>
                {rounds.loserSecond}
              </div>
              <div id="loserside-third-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >L3</h3>
                {rounds.loserThird}
              </div>
              <div id="loserside-fourth-round round" className="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center',
                }}
                >L4</h3>
                {rounds.loserFourth}
              </div>
            </div>
          </div>
        </div>
      </div>);
    } else {
      bracket = <div>loading</div>;
    }
    return (
      <div>{bracket}</div>
    );
  }

}
