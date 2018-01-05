import React from 'react';
import phrases from '../../Phrases';

export default class LeagueNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: phrases.leagueNavigation.admin,
      complete: phrases.leagueNavigation.results,
      elimination: phrases.leagueNavigation.elimination,
      group: phrases.leagueNavigation.group,
      qualifiers: phrases.leagueNavigation.qualifiers,
      finals: phrases.leagueNavigation.finals,
    };
  }

  render() {
    const pagination = this.props.views.map((view, idx) => (<li
      tabIndex={idx}
      className={this.props.view === view
        ? 'active '
        : ''}
      key={view}
    >
      <a
        href="#view"
        role="button"
        onClick={(e) => {
        e.preventDefault();
        this.props.setView(view);
      }}
      >{this.state[view]}</a>
    </li>));

    return (
      <div className="col-xs-12">
        <ul className="pagination">
          {pagination}
        </ul>
      </div>
    );
  }

}
