import React from 'react';
import { DoubleEliminationBracket } from 'lunabrackets-datamodel';

import QualifiersBracket from './QualifiersBracket';
import Icons from './Icons';
import phrases from '../../Phrases';

export default class QualifiersView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.mapBracket = this.mapBracket.bind(this);
  }

  componentWillMount() {
    this.props.getMatches();
  }

  mapBracket() {
    let elem;
    if (!this.props.qualifiers) {
      elem = <Icons type="LOADING" size="40px" />;
    } else if (this.props.qualifiers && this.props.qualifiers.matches.length > 0) {
      const bracket = new DoubleEliminationBracket(this.props.qualifiers.matches, this.props.players, 16);
      elem = <QualifiersBracket raceTo={this.props.league.raceTo} stage={this.props.league.stage} bracket={bracket} matches={this.props.qualifiers.matches} players={this.props.players} update={this.props.update} />;
    } else {
      elem = <h2>{phrases.qualifiersView.qualifiersNotStarted}</h2>;
    }
    return elem;
  }

  render() {
    const elem = this.mapBracket();
    return (
      <div>{elem}</div>
    );
  }

}
