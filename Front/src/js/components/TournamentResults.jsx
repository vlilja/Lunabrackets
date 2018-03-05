import React from 'react';

import phrases from '../../Phrases';
import Icons from './Icons';

export default class TournamentResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.mapResults = this.mapResults.bind(this);
  }

  mapResults() {
    const { players, tournament } = this.props;
    let list;
    if (tournament.results) {
      const results = [];
      tournament.results.results.forEach((result) => {
        const player = players.find(p => p.id === result.player_id);
        results.push(<li
          className="list-group-item"
          key={result.id}
        >{`${player.firstName} ${player.lastName}`}
          <span className="right">{`${phrases.general.place}: ${result.place}`}|
            {`${phrases.general.points}: ${result.points}`}
          </span></li>);
      });
      list = (<ul className="list-group">{results}</ul>);
    }
    return list;
  }

  render() {
    const list = this.mapResults();
    return (<div>
      <h2>{phrases.tournamentResults.heading}</h2>
      <p className="lead">
        {this.props.tournament.name}
      </p>
      <div className="col-xs-12 col-lg-6">
        {list || <Icons type="LOADING" size="40px" />}
      </div>
    </div>);
  }

}
