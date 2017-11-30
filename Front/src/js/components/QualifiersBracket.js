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
      loserSideVisible: true,
    }
    this.toggleWinnerSide = this.toggleWinnerSide.bind(this);
    this.toggleLoserSide = this.toggleLoserSide.bind(this);
    this.mapRounds = this.mapRounds.bind(this);
    this.mapPlayerNames = this.mapPlayerNames.bind(this);
  }

  toggleWinnerSide(){
    var bool = this.state.winnerSideVisible ? false : true;
    this.setState({winnerSideVisible:bool});
  }

  toggleLoserSide(){
    var bool = this.state.loserSideVisible ? false : true;
    this.setState({loserSideVisible:bool});
  }

  mapPlayerNames() {
    this.props.matches.forEach((match) => {
      var pOne,
        pTwo;
      for (var i = 0; i < this.props.players.length; i++) {
        if (this.props.players[i].player_id === match.player_one) {
          match.player_one = this.props.players[i];
        }
        if (this.props.players[i].player_id === match.player_two) {
          match.player_two = this.props.players[i];
        }
      }
    })
  }

  mapRounds() {
    this.mapPlayerNames();
    var firstRound = [];
    var firstRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^[1-8]$/g)
    }).orderBy('match_key').value();
    var i = 0;
    firstRoundMatches.forEach((match, idx) => {
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
    var secondRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^A[1-8]$/g)
    }).orderBy('match_key').value();
    secondRoundMatches.forEach((match, idx) => {
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
    var thirdRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^B[1-8]$/g)
    }).orderBy('match_key').value();
    thirdRoundMatches.forEach((match, idx) => {
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
    var loserFirstRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^L[1-4]$/g)
    }).orderBy('match_key').value();
    loserFirstRoundMatches.forEach((match, idx) => {
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
    var loserSecondRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^L[5-8]$/g)
    }).orderBy('match_key').value();
    var A = 4;
    loserSecondRoundMatches.forEach((match, idx) => {
      loserSecond.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} loserside={'A' + (A - idx)} update={this.props.update}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var loserThird = [];
    var loserThirdRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^L9|L10$/g)
    }).orderBy((match)=> {
      return Number(match.match_key.substring(1));
    }).value();
    loserThirdRoundMatches.forEach((match, idx) => {
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
    var loserFourthRoundMatches = _.chain(this.props.matches).filter((match) => {
      return match.match_key.match(/^L11|L12$/g)
    }).orderBy((match)=> {
      return Number(match.match_key.substring(1));
    }).value();
    var B = 1;
    loserFourthRoundMatches.forEach((match, idx) => {
      loserFourth.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">
            <Match match={match} raceTo={this.props.raceTo} loserside={'B' + (B + idx)} update={this.props.update}></Match>
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
      bracket = <div class="qualifiers-bracket col-xs-12" >
        <div id="winnerside">
          <h2 class="clickable" onClick={this.toggleWinnerSide}>{phrases.qualifiersView.winnerSide} <Icons type={this.state.winnerSideVisible ? 'ARROW-DOWN' : 'ARROW-RIGHT'} inline={true} color="black" size="32px"/></h2>
          <div class="winnerside row" style={{display:(this.state.winnerSideVisible?'block':'none')}}>
            <div id="first-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>R1</h3>
              {rounds.firstRound}
            </div>
            <div id="second-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>W1</h3>
              {rounds.secondRound}
            </div>
            <div id="third-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>W2</h3>
              {rounds.thirdRound}
            </div>
          </div>
        </div>
        <div id="loserside" >
          <h2 class="clickable" onClick={this.toggleLoserSide}>{phrases.qualifiersView.loserSide} <Icons type={this.state.loserSideVisible ? 'ARROW-DOWN' : 'ARROW-RIGHT'} inline={true} color="black" size="32px"/></h2>
          <div class="loserside row" style={{display:(this.state.loserSideVisible?'block':'none')}}>
            <div id="loserside-first-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>L1</h3>
              {rounds.loserFirst}
            </div>
            <div id="loserside-second-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>L2</h3>
              {rounds.loserSecond}
            </div>
            <div id="loserside-third-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>L3</h3>
              {rounds.loserThird}
            </div>
            <div id="loserside-fourth-round" class="col-lg-3">
              <h3 style={{
                textAlign: 'center'
              }}>L4</h3>
              {rounds.loserFourth}
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
