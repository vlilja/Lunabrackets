import React from 'react';

import { SingleEliminationBracket } from 'lunabrackets-datamodel';
import Icons from './Icons';
import FinalsBracket from './FinalsBracket';
import phrases from '../../Phrases';


export default class FinalsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentWillMount() {
    this.props.getMatches();
  }

  componentWillReceiveProps(props) {
    if (props.league && props.league.finals) {
      this.setState({ loading: false });
    }
  }

  render() {
    let element;
    if (this.state.loading) {
      element = <Icons type="LOADING" size="40px" />;
    } else if (this.props.league.finals.matches.length > 0) {
      const bracket = new SingleEliminationBracket(this.props.league.finals.matches, this.props.league.players, 8);
      element = <FinalsBracket matches={this.props.league.finals.matches} stage={this.props.league.stage} players={this.props.league.players} bracket={bracket} raceTo={this.props.league.raceTo} update={this.props.update} />;
    } else {
      element = <h2>{phrases.finalsView.finalsNotStarted}</h2>;
    }
    return (
      <div>{element}</div>
    );
  }

}
