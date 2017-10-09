import React from "react";
import {connect} from "react-redux";
import BracketColumn from "./BracketColumn";


export default class Winnerside extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        matches: props.matches
        brackets:[]
      }
    }

    splitMatchesToColumns() {
        var {matches, brackets} = this.state;
        var bracket = [];
        var k = (matches.length + 1) / 2;
        var i = 1;
        while (matches.length > 0) {
            if (i === k) {
                bracket.push(matches.shift());
                brackets.push(bracket);
                i = 1;
                k /= 2;
                bracket = []
            } else {
                bracket.push(matches.shift());
                i++;
            }
        }
        return brackets;
    }

    render() {
      const mappedBrackets = this.state.brackets.map((bracket, index) => {
          return <BracketColumn handicap={this.props.handicap} key={index} round={index+1} matches={bracket} updateMatch={this.updateMatch}/>
      })
      return {
        <div>
        {mappedBrackets}
        </div>
      }
    }

}
