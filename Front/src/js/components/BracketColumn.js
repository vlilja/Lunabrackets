import React from "react";
import { connect } from "react-redux";
import Seed from "./Seed";


export default class BracketColumn extends React.Component {

  constructor(props){
    super(props);
    this.mapMatches = this.mapMatches.bind(this);
  }

  componentWillMount(){

  }

  mapMatches(){
    console.log()
    var mappedMatches=[]
    for(var i = 0; i < this.props.matches.length; i++){
      mappedMatches.push(<Seed matchId={i}/>);
    }
    return mappedMatches;
  }

  render(){
    var mappedMatches = this.mapMatches();
    console.log(mappedMatches);
    return(
      <div className="lunaux-bracket-column">
        {mappedMatches}
      </div>
    )
  }

}
