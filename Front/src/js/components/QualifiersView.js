import React from "react";
import QualifiersBracket from "./QualifiersBracket";
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
    var elem = <Icons type="LOADING" size="32px" />
    if(this.props.qualifiers) {
      elem = <QualifiersBracket raceTo={this.props.league.raceTo} matches={this.props.qualifiers.matches} players={this.props.players} update={this.props.update}/>
    }
    return (
      <div>{elem}</div>
    )
  }

}
