import React from "react";
import phrases from "../../Phrases";

export default class LeagueNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ready:phrases.leagueNavigation.admin,
      results:phrases.leagueNavigation.results,
      elimination:phrases.leagueNavigation.elimination,
      group:phrases.leagueNavigation.group,
      qualifiers:phrases.leagueNavigation.qualifiers,
      finals: phrases.leagueNavigation.finals
    }
  }

  render() {
    const pagination = this.props.views.map((view, idx) => {
      return <li class={this.props.view === view
        ? "active"
        : ""} onClick={(e) => {
        e.preventDefault();
        this.props.setView(view)
      }} key={idx}>
        <a href="#">{this.state[view]}</a>
      </li>
    })

    return (
      <div class="col-xs-12">
        <ul class="pagination">
          {pagination}
        </ul>
      </div>
    )
  }

}
