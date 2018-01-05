import React from 'react';
import Icons from './Icons';
import phrases from '../../Phrases';

export default class ResultsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.mapResults = this.mapResults.bind(this);
  }

  componentWillMount() {
    if (this.props.league.stage === 'complete') {
      this.props.getResults();
    }
  }

  mapResults() {
    if (this.props.league.results) {
      const { results } = this.props.league;
      const mappedResults = [];
      results.forEach((result) => {
        const player = this.props.league.players.find(p => p.id === result.player_id);
        result.player = player;
        mappedResults.push(<li key={player.id} className="list-group-item">{`${result.place}. ${player.firstName} ${player.lastName}`}
          <span className="right">{`${phrases.resultsView.points}: ${result.points}`}</span>
        </li>);
      });
      return (<span><h2>{phrases.resultsView.heading}</h2><ul className="list-group">{mappedResults}</ul></span>);
    }
    return <h3>{phrases.resultsView.leagueNotFinished}</h3>;
  }

  render() {
    const mappedResults = this.mapResults();
    return (
      <div className="col-lg-6 col-xs-12">
        {this.props.loading
          ? <Icons type="LOADING" size="40px" /> : mappedResults}
      </div>
    );
  }

}
