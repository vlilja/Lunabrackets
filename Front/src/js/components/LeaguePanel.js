import React from "react";
import phrases from "../../Phrases";
import {Link} from "react-router-dom";
import helper from "../classes/helper";

export default class LeaguePanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameName:''
    }
    this.setGameName = this.setGameName.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.setGameName(this.props.league.game);
  }

  handleClick(event) {
    this.props.navigateTo(this.props.league.id)
  }

  setGameName(gameId) {
    this.setState({gameName:helper.determineGameName(gameId)});
  }

  render() {
    return (
      <div class="panel panel-primary clickable" onClick={this.handleClick} >
        <div class="panel-heading">
          <h3 class="panel-title">{this.props.league.name}</h3>
        </div>
        <div class="panel-body">
          <label>{phrases.general.game}:</label> {this.state.gameName}<br/>
          <label>{phrases.general.stage}:</label> {this.props.league.stage}
        </div>
      </div>
    )
  }

}
