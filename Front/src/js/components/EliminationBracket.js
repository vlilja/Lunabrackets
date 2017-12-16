import React from "react";
import Match from "./Match";
import Icons from "./Icons";
import Modal from "react-modal";
import _ from "lodash";
import phrases from "../../Phrases";

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
    var bracket = this.props.bracket;
    var firstRound = [];
    bracket.rounds.R1.forEach((match, idx) => {
      firstRound.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var secondRound = [];
    bracket.rounds.A.forEach((match, idx) => {
      secondRound.push(
        <div key={idx} class="col-xs-12">
          <div class="panel match col-xs-12">
            <Match match={match} update={this.update} raceTo={this.props.raceTo}></Match>
          </div>
          <div class="match-padding-half col-xs-12"></div>
        </div>
      )
    })
    var thirdRound = [];
    bracket.rounds.B.forEach((match, idx) => {
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
    var fourthRound = [];
    bracket.rounds.C.forEach((match, idx) => {
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
      <div class="col-xs-12 bracket">
        <h2>{phrases.eliminationView.bracketHeading}</h2>
        <div class="elimination-bracket">
          <div id="round firstround" class="col-lg-3 col-xs-3">
            {rounds.firstRound}
          </div>
          <div id="round secondround" class="col-lg-3 col-xs-3">
            {rounds.secondRound}
          </div>
          <div id="round thirdround" class="col-lg-3 col-xs-3">
            {rounds.thirdRound}
          </div>
          <div id="round fourthround" class="col-lg-3 col-xs-3">
            {rounds.fourthRound}
          </div>
        </div>
      </div>
    )
  }

}
