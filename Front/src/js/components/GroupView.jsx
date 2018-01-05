import React from 'react';
import { RoundRobinBracket } from 'lunabrackets-datamodel';

import Icons from './Icons';
import GroupBracket from './GroupBracket';
import phrases from '../../Phrases';

export default class GroupView extends React.Component {

  constructor(props) {
    super(props);
    this.mapGroups = this.mapGroups.bind(this);
  }

  componentWillMount() {
    this.props.getGroups();
  }

  mapGroups() {
    let groups = [];
    const groupsKeys = Object.keys(this.props.league.groups);
    groupsKeys.forEach((key) => {
      const bracket = new RoundRobinBracket(this.props.league.groups[key].matches, null, this.props.league.groups[key].players);
      groups.push(<GroupBracket key={key} stage={this.props.league.stage} raceTo={this.props.league.raceTo} bracket={bracket} group={this.props.league.groups[key]} updateMatch={this.props.updateGroupStageMatch} />);
    });
    if (groups.length === 0) {
      groups = <h2>{phrases.groupView.groupStageNotStarted}</h2>;
    }
    return groups;
  }

  render() {
    let element;
    let mappedGroups;
    if (!this.props.league.groups) {
      element = <Icons type="LOADING" size="40px" />;
    } else {
      mappedGroups = this.mapGroups();
    }
    return (
      <div className="col-xs-12">
        {element}
        <div className="col-xs-12">
          {mappedGroups}
        </div>
      </div>
    );
  }

}
