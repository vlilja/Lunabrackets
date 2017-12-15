import React from "react";
import Match from "./Match";
import Icons from "./Icons";
import _ from "lodash";
import phrases from "../../Phrases";

export default class QualifiersBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      winnerSideVisible: true,
      loserSideVisible: true
    }
    this.toggleWinnerSide = this.toggleWinnerSide.bind(this);
    this.toggleLoserSide = this.toggleLoserSide.bind(this);
    this.mapRounds = this.mapRounds.bind(this);
  }

  toggleWinnerSide() {
    var bool = this.state.winnerSideVisible
      ? false
      : true;
    this.setState({winnerSideVisible: bool});
  }

  toggleLoserSide() {
    var bool = this.state.loserSideVisible
      ? false
      : true;
    this.setState({loserSideVisible: bool});
  }

  mapRounds() {
    var firstRound = [];
    var bracket = this.props.bracket;
    console.log(bracket);
    var firstRound = [];
    bracket.upperBracket.R1.matches.forEach((match, idx) => {
      firstRound.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var secondRound = [];
    bracket.upperBracket.A.matches.forEach((match, idx) => {
      secondRound.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
    })
    var thirdRound = [];
    bracket.upperBracket.B.matches.forEach((match, idx) => {
      thirdRound.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-double"></div>
          <div class="col-xs-12 match-padding-one-quarter"></div>
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="col-xs-12 match-padding-double"></div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
        </div>
      )
    })
    var loserFirst = [];
    bracket.lowerBracket.L1.matches.forEach((match, idx) => {
      loserFirst.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var loserSecond = [];
    bracket.lowerBracket.L2.matches.forEach((match, idx) => {
      loserSecond.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} loserside={bracket.lowerBracket.L2.playersFrom + String(idx+1)} update={this.props.update}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var loserThird = [];
    bracket.lowerBracket.L3.matches.forEach((match, idx) => {
      loserThird.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
    })
    var loserFourth = [];
    bracket.lowerBracket.L4.matches.forEach((match, idx) => {
      loserFourth.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} loserside={bracket.lowerBracket.L4.playersFrom + String(bracket.lowerBracket.L4.matches.length-idx)} update={this.props.update}></Match>
          </div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
    })
    var rounds = {
      firstRound: firstRound,
      secondRound: secondRound,
      thirdRound: thirdRound,
      loserFirst: loserFirst,
      loserSecond: loserSecond,
      loserThird: loserThird,
      loserFourth: loserFourth
    }
    return rounds;
  }

  render() {
    var bracket,
      ready;
    if (this.props.matches) {
      const rounds = this.mapRounds();
      bracket = <div class="bracket col-xs-12">
        <div class="qualifiers-bracket">
          <div id="winnerside">
            <h2 class="clickable" onClick={this.toggleWinnerSide}>{phrases.qualifiersView.winnerSide}
              <Icons type={this.state.winnerSideVisible
                ? 'ARROW-DOWN'
                : 'ARROW-RIGHT'} inline={true} color="black" size="32px"/></h2>
              <div class="winnerside row" style={{
              display: (this.state.winnerSideVisible
                ? 'block'
                : 'none')
            }}>
              <div id="first-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>R1</h3>
                {rounds.firstRound}
              </div>
              <div id="second-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>W1</h3>
                {rounds.secondRound}
              </div>
              <div id="third-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>W2</h3>
                {rounds.thirdRound}
              </div>
            </div>
          </div>
          <div id="loserside">
            <h2 class="clickable" onClick={this.toggleLoserSide}>{phrases.qualifiersView.loserSide}
              <Icons type={this.state.loserSideVisible
                ? 'ARROW-DOWN'
                : 'ARROW-RIGHT'} inline={true} color="black" size="32px"/></h2>
            <div class="loserside row" style={{
              display: (this.state.loserSideVisible
                ? 'block'
                : 'none')
            }}>
              <div id="loserside-first-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>L1</h3>
                {rounds.loserFirst}
              </div>
              <div id="loserside-second-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>L2</h3>
                {rounds.loserSecond}
              </div>
              <div id="loserside-third-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>L3</h3>
                {rounds.loserThird}
              </div>
              <div id="loserside-fourth-round round" class="col-lg-3 col-xs-3">
                <h3 style={{
                  textAlign: 'center'
                }}>L4</h3>
                {rounds.loserFourth}
              </div>
            </div>
          </div>
        </div>
      </div>
    } else {
      bracket = <div>loading</div>
    }
    return (
      <div>{bracket}</div>
    )
  }

}
