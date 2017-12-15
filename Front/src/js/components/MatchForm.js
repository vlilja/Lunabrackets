import React from "react";
import phrases from "../../Phrases";

export default class MatchForm extends React.Component {

  constructor(props) {
    super(props);
    var playerOneScore,
      playerTwoScore;
    if (props.match.playerOne.score && props.match.playerTwo.score) {
      playerOneScore = props.match.playerOne.score;
      playerTwoScore = props.match.playerTwo.score;
    } else {
      playerOneScore = Number(this.props.match.playerOne.details.handicap);
      playerTwoScore = Number(this.props.match.playerTwo.details.handicap);
    }
    this.state = {
      playerOneScore: playerOneScore,
      playerTwoScore: playerTwoScore,
      invalidEntry: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
  }

  handleChange(e) {
    var target = e.target;
    var name = target.name
    var value = target.value;
    try {
      if (Number(value) > Number(this.props.raceTo)) {
        value = this.props.raceTo;
      }
    }
    catch (error) {
      value = 0;
    }
    this.setState({[name]: value});
  }

  update() {
    var match = this.props.match;
    try {
      var p1 = {
        score: Number(this.state.playerOneScore),
        handicap: Number(this.props.match.playerOne.details.handicap)
      }
      var p2 = {
        score: Number(this.state.playerTwoScore),
        handicap: Number(this.props.match.playerTwo.details.handicap)
      }
      var raceTo = Number(this.props.raceTo);
      if ((p1.score === raceTo && (p2.score >= p2.handicap && p2.score < raceTo)) || (p2.score === raceTo && (p1.score >= p1.handicap && p1.score < raceTo))) {
        match.setScore(this.state.playerOneScore, this.state.playerTwoScore);
        this.props.update(match);
        this.props.closeModal();
      } else {
        this.setState({invalidEntry: true});
      }
    } catch (error) {
      console.log(error);
      this.setState({invalidEntry: true});
    }
  }

  render() {
    const match = this.props.match;
    const playerOne = match.playerOne.details;
    const playerTwo = match.playerTwo.details;
    return (
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-6">
            <h2>{phrases.groupView.matchScoreFormHeading}</h2>
          </div>
          <div class="col-xs-offset-5 col-xs-1">
            <i class="fa fa-window-close" style={{
              fontSize: '30px'
            }} aria-hidden="true" onClick={this.props.closeModal}></i>
          </div>
        </div>
        <div class="form-group margin-top">
          <label class="col-xs-offset-1 col-xs-3" for="playerOneScore">{playerOne.firstName + ' ' + playerOne.lastName}
            <br/>
            <span class="badge">{playerOne.handicap}</span>
          </label>
          <div class="col-xs-2">
            <input class="form-control" name="playerOneScore" type="number" min={0} max={this.props.raceTo} value={this.state.playerOneScore} onChange={this.handleChange}></input>
          </div>
          <div class="col-xs-1" style={{
            textAlign: 'center'
          }}>{phrases.general.ndash}</div>
          <div class="col-xs-2">
            <input class="form-control" name="playerTwoScore" type="number" min={0} max={this.props.raceTo} value={this.state.playerTwoScore} onChange={this.handleChange}></input>
          </div>
          <label class="col-xs-3" for="playerTwoScore">{playerTwo.firstName + ' ' + playerTwo.lastName}
            <br/>
            <span class="badge">{playerTwo.handicap}</span>
          </label>
        </div>
        {this.state.invalidEntry
          ? <div class="col-xs-offset-1" style={{
              color: 'red'
            }}>
              {phrases.errorMessages.invalidScore}
            </div>
          : ''}
        <div class="col-xs-12 margin-top-double ">
          <button class="btn btn-primary" onClick={this.update}>{phrases.groupView.update}</button>
        </div>
      </div>
    )
  }
}
