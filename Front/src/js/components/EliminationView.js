import React from "react";
import Icons from "./Icons";
import EliminationBracket from "./EliminationBracket";
import {MegaEliminationBracket} from "lunabrackets-datamodel";



export default class EliminationView extends React.Component {

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
    if(props.league && props.league.elimination){
      this.setState({loading:false});
    }
  }

  render() {
    var element;
    if(this.state.loading){
      element = <Icons type="LOADING" size="32px" />
    }
    else {
      var bracket = new MegaEliminationBracket(this.props.league.elimination.matches, this.props.league.players, 12);
      element = <EliminationBracket raceTo={this.props.league.raceTo} bracket={bracket} matches={this.props.league.elimination.matches} players={this.props.league.players} update={this.props.update} />
    }
    return (
      <div>{element}</div>
    )
  }

}
