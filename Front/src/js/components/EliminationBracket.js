import React from "react";
import Match from "./Match";
import _ from "lodash";
import phrases from "../../Phrases";

export default class EliminationBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.update = this.update.bind(this);
    this.mapRounds = this.mapRounds.bind(this);
  }

  update(match) {
    this.props.update(match);
  }

  mapRounds() {
    var matches = this.props.matches;
    var players = this.props.players;
    matches.forEach((match) => {
      players.forEach((player) => {
        if (match.player_one === player.player_id) {
          match.player_one = player;
        }
        if (match.player_two === player.player_id) {
          match.player_two = player;
        }
      })
    })
    var firstRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^[1-4]$/g)
    }).orderBy('match_key').value();
    var firstRound = [];
    firstRoundMatches.forEach((match, idx) => {
      firstRound.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var secondRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^[5-8]$/g)
    }).orderBy(('match_key')).value();
    var secondRound = [];
    secondRoundMatches.forEach((match, idx) => {
      secondRound.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var thirdRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^9|10$/g)
    }).orderBy((match)=> {
      return Number(match.match_key)
    }).value();
    console.log(thirdRoundMatches);
    var thirdRound = [];
    thirdRoundMatches.forEach((match, idx) => {
      thirdRound.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var fourthRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^11$/g)
    }).orderBy('match_key').value();
    var fourthRound = [];
    fourthRoundMatches.forEach((match, idx) => {
      fourthRound.push(
        <div key={idx} class="col-xs-12">
          <div class="col-xs-12 match-padding-double"></div>
          <div class="col-xs-12 match-padding-one-quarter"></div>
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="col-xs-12 match-padding-three-quarters"></div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var rounds = {
      firstRound: firstRound,
      secondRound: secondRound,
      thirdRound: thirdRound,
      fourthRound: fourthRound
    }
    return rounds;
  }

  render() {
    var rounds = this.mapRounds();
    return (
      <div class="col-xs-12 elimination-bracket">
        <h2>{phrases.eliminationView.bracketHeading}</h2>
        <div class="">
          <div id="firstround" class="col-lg-3">
            {rounds.firstRound}
          </div>
          <div id="secondround" class="col-lg-3">
            {rounds.secondRound}
          </div>
          <div id="thirdround" class="col-lg-3">
            {rounds.thirdRound}
          </div>
          <div id="fourthround" class="col-lg-3">
            {rounds.fourthRound}
          </div>
        </div>
      </div>
    )
  }

}
