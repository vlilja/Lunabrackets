import React from 'react';
import { MegaEliminationBracket } from 'lunabrackets-datamodel';

import Icons from './Icons';
import EliminationBracket from './EliminationBracket';
import phrases from '../../Phrases';


export default class EliminationView extends React.Component {

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
    if (props.league && props.league.elimination) {
      this.setState({ loading: false });
    }
  }

  render() {
    let element;
    if (this.state.loading) {
      element = <Icons type="LOADING" size="40px" />;
    } else if (this.props.league.elimination.matches.length > 0) {
      const bracket = new MegaEliminationBracket(this.props.league.elimination.matches, this.props.league.players, 12);
      element = <EliminationBracket raceTo={this.props.league.raceTo} stage={this.props.league.stage} bracket={bracket} matches={this.props.league.elimination.matches} players={this.props.league.players} update={this.props.update} />;
    } else {
      element = <h2>{phrases.eliminationView.eliminationNotStarted}</h2>;
    }
    return (
      <div>{element}</div>
    );
  }

}
