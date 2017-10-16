import React from "react";
import QualifiersBracket from "./QualifiersBracket";


export default class QualifiersView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: [],
      matches: []
    }
    for(var i = 0 ; i<16; i++) {
      this.state.players.push({
        id:i
      })
    }
    for(var i = 0 ; i<26; i++) {
      this.state.matches.push({
        id:i+1
      })
    }
  }

  render() {
    return (<div>
      <QualifiersBracket players={this.state.players} matches={this.state.matches}/>
    </div>)
  }

}
