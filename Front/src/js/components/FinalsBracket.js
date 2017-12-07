import React from "react";
import Match from "./Match";
import _ from "lodash";
import phrases from "../../Phrases";

export default class FinalsBracket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.mapRounds = this.mapRounds.bind(this);
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
            <Match match={match} raceTo={this.props.raceTo} update={this.props.update}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var secondRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^[5-6]$/g)
    }).orderBy('match_key').value();
    var secondRound = [];
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
    var thirdRoundMatches = _.chain(matches).filter((match) => {
      return match.match_key.match(/^7$/g)
    }).orderBy('match_key').value();
    var thirdRound = [];
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
    var rounds = {
      firstRound: firstRound,
      secondRound: secondRound,
      thirdRound: thirdRound
    }
    return rounds;
  }

  render() {
    var rounds = this.mapRounds();
    return (
      <div class="col-xs-12 bracket">
        <h2>{phrases.finalsView.bracketHeading}</h2>
        <div class="finals-bracket">
          <div id="round firstround" class="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center'
            }}>{phrases.finalsView.quarterFinals}</h3>
            {rounds.firstRound}
          </div>
          <div id="round secondround" class="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center'
            }}>{phrases.finalsView.semiFinals}</h3>
            {rounds.secondRound}
          </div>
          <div id="round thirdround" class="col-lg-3 col-xs-4">
            <h3 style={{
              textAlign: 'center'
            }}>{phrases.finalsView.final}</h3>
            {rounds.thirdRound}
          </div>
        </div>
      </div>
    )
  }

}
