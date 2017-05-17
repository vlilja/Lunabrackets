import React from "react";
import {connect} from "react-redux";
import Match from "./Match";

export default class BracketColumn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          matches:[]
        }
        this.mapMatches = this.mapMatches.bind(this);
    }

    mapMatches(matches) {
        var mappedMatches = [];
        var matches = this.props.matches;
            for (var i = 0; i < matches.length; i++) {
                mappedMatches.push(<Match key={i} match={matches[i]} updateMatch={this.props.updateMatch}/>);
                if (this.props.round % 2 === 0 && i % 2 === 0 && matches.length > 2) {
                    mappedMatches.push(
                        <div key={'separator' + i} className="separator"></div>
                    );
                }
            }
            this.state.matches = mappedMatches;
    }

    render() {
      this.mapMatches();
      if(this.state.matches.length > 1){
        var upperHalf = this.state.matches.slice(0, this.state.matches.length/2);
        var bottomHalf = this.state.matches.slice(this.state.matches.length/2, this.state.matches.length);
        return (<div className = "bracket-column">
          <h3>Round {this.props.round}</h3>
          <div className="upperHalf">
            <div className="wrapper">{upperHalf}</div></div>
          <div className="bottomHalf"><div className="wrapper">{bottomHalf}</div></div>
        </div>)
      }
      else {
        return(<div className="bracket-column">
          <h3>Finalround</h3>
          <div className="finalRound">
          <div className="wrapper">{this.state.matches}</div>
          </div>
        </div>)
      }

    }

}
