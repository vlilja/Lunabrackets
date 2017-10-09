import React from "react";
import Icons from "./Icons";

export default class GroupView extends React.Component {

  constructor(props) {
    super(props);
    this.mapGroups = this.mapGroups.bind(this);
  }

  componentWillMount() {
    this.props.getGroups();
  }

  mapGroups() {
    return this.props.league.groups.map((group, idx) => {
      return <li key={idx}>{group.name}</li>
    })
  }

  render() {
    var element;
    if (!this.props.league.groups) {
      element = <Icons type="LOADING" size="40px"/>
    } else {
      const mappedGroups = this.mapGroups();
      element = <ul>{mappedGroups}</ul>
    }
    return (
      <div>
        {element}
      </div>
    )
  }

}
