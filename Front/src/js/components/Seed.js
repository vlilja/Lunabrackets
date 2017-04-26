import React from "react";
import { connect } from "react-redux";


export default class Seed extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      player1Score:0,
      player2Score:0
    }
    if(this.props.handicapEnabled){
      this.state.player1Score+=this.props.player1.handicap;
      this.state.player2Score+=this.props.player2.handicap;
    }
  }

  componentWillMount() {

  }

  render(){
    return (<div>SEED {this.props.matchId}</div>
      /*var {player1, player2} = this.props;
      <div>
        <div>{player1.firstName} {player1.lastName} <span> {player1Score}</span></div>
        <div>{player2.firstName} {player2.lastName} <span> {player2Score}</span></div>
      </div>*/
    )
  }

}
