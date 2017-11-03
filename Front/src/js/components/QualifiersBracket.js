import React from "react";

export default class QualifiersBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
    this.mapRounds = this.mapRounds.bind(this);
  }

  mapRounds() {
    var firstRound = [];
    var i = 0;
    while (i < 8) {
      firstRound.push(
        <div key={i} class="col-xs-12">
          <div class="panel match col-xs-12">{this.props.matches[i].id}</div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
      i++;
    }
    var secondRound = [];
    var a = 'A'
    var k = 1;
    while (i < 12) {
      secondRound.push(
        <div key={i} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">{this.props.matches[i].id +' '+ a+k}</div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
      i++;
      k++;
    }
    var thirdRound = [];
    var b = 'B'
    var k = 1;
    while (i < 14) {
      thirdRound.push(
        <div key={i} class="col-xs-12">
          <div class="col-xs-12 match-padding-double"></div>
          <div class="col-xs-12 match-padding-one-quarter"></div>
          <div class="panel match col-xs-12">{this.props.matches[i].id +' '+ b+k}</div>
          <div class="col-xs-12 match-padding-double"></div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
        </div>
      )
      i++;
      k++;
    }
    var loserFirst = [];
    while (i < 18) {
      loserFirst.push(
        <div key={i} class="col-xs-12">
          <div class="panel match col-xs-12">{this.props.matches[i].id}</div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
      i++;
    }
    var loserSecond = [];
    k=4;
    while (i < 22) {
      loserSecond.push(
        <div key={i} class="col-xs-12">
          <div class="panel match col-xs-12">{this.props.matches[i].id +' '+ a+k}</div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
      i++;
      k--;
    }
    var loserThird = [];
    while (i < 24) {
      loserThird.push(
        <div key={i} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">{this.props.matches[i].id}</div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
      i++;
    }
    k=1;
    var loserFourth = [];
    while (i < 26) {
      loserFourth.push(
        <div key={i} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">{this.props.matches[i].id +' '+ b+k}</div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="col-xs-12 match-padding-half"></div>
        </div>
      )
      i++;
      k++;
    }
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
    const rounds = this.mapRounds();
    return (
      <div class="qualifiers-bracket">
        <h2>Winner side</h2>
        <div class="winnerside row">
          <div id="first-round" class="col-xs-2">
            {rounds.firstRound}
          </div>
          <div id="second-round" class="col-xs-2">
            {rounds.secondRound}
          </div>
          <div id="third-round" class="col-xs-2">
            {rounds.thirdRound}
          </div>
        </div>
        <h2>Loser side</h2>
        <div class="loserside row">
          <div id="loserside-first-round" class="col-xs-2">
            {rounds.loserFirst}
          </div>
          <div id="loserside-second-round" class="col-xs-2">
            {rounds.loserSecond}
          </div>
          <div id="loserside-third-round" class="col-xs-2">
            {rounds.loserThird}
          </div>
          <div id="loserside-fourth-round" class="col-xs-2">
            {rounds.loserFourth}
          </div>
        </div>
      </div>
    )
  }

}
