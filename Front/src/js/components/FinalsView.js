import React from "react";
import Icons from "./Icons";
import FinalsBracket from "./FinalsBracket";


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
    if(this.state.loading){
      element = <Icons type="LOADING" size="32px" />
    }
    else {
      element = <FinalsBracket matches={this.props.league.finals.matches} players={this.props.league.participants} raceTo={this.props.league.raceTo} update={this.props.update}/>
    }
    return (
      <div>{element}</div>
    )
  }

}
