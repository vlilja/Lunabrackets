import React from 'react';
import phrases from '../../Phrases';

export default class MatchForm extends React.Component {

  constructor(props) {
    super(props);
    let playerOneScore;
    let playerTwoScore;
    if (props.match.playerOne.score && props.match.playerTwo.score) {
      playerOneScore = Number(props.match.playerOne.score);
      playerTwoScore = Number(props.match.playerTwo.score);
    } else {
      playerOneScore = Number(this.props.match.playerOne.details.handicap);
      playerTwoScore = Number(this.props.match.playerTwo.details.handicap);
    }
    this.state = {
      playerOneScore,
      playerTwoScore,
      raceTo: Number(this.props.raceTo),
      invalidEntry: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
  }

  handleChange(e) {
    const { target } = e;
    const { name } = target;
    let { value } = target;
    try {
      if (Number(value) > this.state.raceTo) {
        value = this.state.raceTo;
      }
    } catch (error) {
      value = 0;
    }
    this.setState({ [name]: value });
  }

  update() {
    const { match } = this.props;
    try {
      const p1 = {
        score: Number(this.state.playerOneScore),
        handicap: Number(this.props.match.playerOne.details.handicap),
      };
      const p2 = {
        score: Number(this.state.playerTwoScore),
        handicap: Number(this.props.match.playerTwo.details.handicap),
      };
      const raceTo = Number(this.props.raceTo);
      if ((p1.score === raceTo && (p2.score >= p2.handicap && p2.score < raceTo)) || (p2.score === raceTo && (p1.score >= p1.handicap && p1.score < raceTo))) {
        match.setScore(this.state.playerOneScore, this.state.playerTwoScore);
        this.props.update(match);
        this.props.closeModal();
      } else {
        this.setState({ invalidEntry: true });
      }
    } catch (error) {
      console.log(error);
      this.setState({ invalidEntry: true });
    }
  }

  render() {
    const { match } = this.props;
    const playerOne = match.playerOne.details;
    const playerTwo = match.playerTwo.details;
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-6">
            <h2>{phrases.groupView.matchScoreFormHeading}</h2>
          </div>
          <div className="col-xs-offset-5 col-xs-1">
            <i
              className="fa fa-window-close"
              style={{
              fontSize: '30px',
            }}
              aria-hidden="true"
              onClick={this.props.closeModal}
            />
          </div>
        </div>
        <div className="form-group margin-top">
          <label className="col-xs-offset-1 col-xs-3" htmlFor="playerOneScore">{`${playerOne.firstName} ${playerOne.lastName}`}
            <br />
            <span className="badge">{playerOne.handicap}</span>
          </label>
          <div className="col-xs-2">
            <input className="form-control" name="playerOneScore" type="number" min="0" max={this.props.raceTo} value={this.state.playerOneScore} onChange={this.handleChange} />
          </div>
          <div
            className="col-xs-1"
            style={{
            textAlign: 'center',
          }}
          >{phrases.general.ndash}</div>
          <div className="col-xs-2">
            <input className="form-control" name="playerTwoScore" type="number" min="0" max={this.props.raceTo} value={this.state.playerTwoScore} onChange={this.handleChange} />
          </div>
          <label className="col-xs-3" htmlFor="playerTwoScore">{`${playerTwo.firstName} ${playerTwo.lastName}`}
            <br />
            <span className="badge">{playerTwo.handicap}</span>
          </label>
        </div>
        {this.state.invalidEntry
          ? <div
            className="col-xs-offset-1"
            style={{
              color: 'red',
            }}
          >
            {phrases.errorMessages.invalidScore}
          </div>
          : ''}
        <div className="col-xs-12 margin-top-double ">
          <button className="btn btn-primary" onClick={this.update}>{phrases.groupView.update}</button>
        </div>
      </div>
    );
  }
}
