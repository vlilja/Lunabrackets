import React from "react";
import Icons from "./Icons";
import EliminationBracket from "./EliminationBracket";


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
      element = <EliminationBracket raceTo={this.props.league.raceTo} matches={this.props.league.elimination.matches} players={this.props.league.participants} update={this.props.update} />
    }
    return (
      <div>{element}</div>
    )
  }

}
