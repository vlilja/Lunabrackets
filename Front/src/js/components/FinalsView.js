import React from "react";
import Icons from "./Icons";
import FinalsBracket from "./FinalsBracket";
import {SingleEliminationBracket} from "lunabrackets-datamodel";


export default class FinalsView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading:true
    }
  }

  componentWillMount() {
    this.props.getMatches();
  }

  componentWillReceiveProps(props) {
    if(props.league && props.league.finals){
      this.setState({loading:false});
    }
  }

  render() {
    var element;
    if(this.state.loading || !this.props.league.finals){
      element = <Icons type="LOADING" size="40px" />
    }
    else {
      var bracket = new SingleEliminationBracket(this.props.league.finals.matches, this.props.league.players, 8);
      element = <FinalsBracket matches={this.props.league.finals.matches} players={this.props.league.players} bracket={bracket} raceTo={this.props.league.raceTo} update={this.props.update}/>
    }
    return (
      <div>{element}</div>
    )
  }

}
