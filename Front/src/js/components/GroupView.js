import React from "react";
import Icons from "./Icons";
import GroupBracket from "./GroupBracket";
import {RoundRobinBracket} from "lunabrackets-datamodel";
import Modal from "react-modal";

export default class GroupView extends React.Component {

  constructor(props) {
    super(props);
    this.mapGroups = this.mapGroups.bind(this);
  }

  componentWillMount() {
    this.props.getGroups();
  }

  mapGroups() {
    var groups = [];
      for(var key in this.props.league.groups) {
        var bracket = new RoundRobinBracket(this.props.league.groups[key].matches, null, this.props.league.groups[key].players);
        groups.push(<GroupBracket key={key} stage={this.props.league.stage} raceTo={this.props.league.raceTo} bracket={bracket} group={this.props.league.groups[key]} updateMatch={this.props.updateGroupStageMatch}/>);
      }
      return groups;
  }

  render() {
    var element, mappedGroups;
    if (!this.props.league.groups) {
      element = <Icons type="LOADING" size="40px"/>
    } else {
      mappedGroups = this.mapGroups();
    }
    return (
      <div class="col-xs-12">
        {element}
        <div class="col-xs-12">
          {mappedGroups}
        </div>
      </div>
    )
  }

}
