import React from "react";
import { connect } from "react-redux";
import BracketColumn from "./BracketColumn";
import {getSingleEliminationMatches} from "../actions/tournamentActions";

@connect((store) => {
    return {matches: store.tournament.selectedTournamentMatches};
})


export default class BracketContainer extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      rounds:0
    }
  }

  componentWillMount(){
    this.props.dispatch(getSingleEliminationMatches(this.props.tournamentId));
  }

  render(){
    console.log(this.props.matches);
    return (<div className="row">
      <BracketColumn matches={this.props.matches}/>
    </div>)
  }

}
