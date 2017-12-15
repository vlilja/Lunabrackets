import React from "react";
import QualifiersBracket from "./QualifiersBracket";
import {DoubleEliminationBracket} from "lunabrackets-datamodel";
import Icons from "./Icons";

export default class QualifiersView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.getMatches();
  }

  render() {
    var elem = <Icons type="LOADING" size="40px" />
    if(this.props.qualifiers) {
      var bracket = new DoubleEliminationBracket(this.props.qualifiers.matches, this.props.players, 16);
      elem = <QualifiersBracket raceTo={this.props.league.raceTo} bracket={bracket} matches={this.props.qualifiers.matches} players={this.props.players} update={this.props.update}/>
    }
    return (
      <div>{elem}</div>
    )
  }

}
