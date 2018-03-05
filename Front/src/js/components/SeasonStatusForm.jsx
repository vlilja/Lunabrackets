import React from 'react';

import phrases from '../../Phrases';

export default class SeasonStatusFrom extends React.Component {

  constructor(props) {
    super(props);
    let selectedSeason;
    if (props.seasons.length > 0) {
      selectedSeason = props.seasons[0].id;
    }
    this.state = {
      selectedSeason,
    };
    this.mapOptions = this.mapOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.activate = this.activate.bind(this);
    this.inactivate = this.inactivate.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ selectedSeason: value });
  }

  activate() {
    this.props.changeSeasonStatus(this.state.selectedSeason, 1);
  }

  inactivate() {
    this.props.changeSeasonStatus(this.state.selectedSeason, 0);
  }

  mapOptions() {
    const options = [];
    const { seasons } = this.props;
    seasons.forEach((season) => {
      options.push(<option key={season.id} value={season.id}>{season.name}</option>);
    });
    return options;
  }

  render() {
    const options = this.mapOptions();
    return (<div className="col-xs-12">
      <h3>{phrases.seasonStatusForm.heading}</h3>
      <div className="col-xs-12">
        <div className="col-xs-12">
          <select className="form-control" value={this.state.selectedSeason} onChange={this.handleChange}>
            {options};
          </select>
        </div>
        <div className="col-xs-12 margin-top">
          <div className="col-xs-2">
            <button
              className="btn btn-primary"
              onClick={this.activate}
            >{phrases.seasonStatusForm.activate}</button>
          </div>
          <div className="col-xs-2 col-xs-offset-1">
            <button
              className="btn btn-primary"
              onClick={this.inactivate}
            >{phrases.seasonStatusForm.inactivate}</button>
          </div>
        </div>
      </div>
    </div>);
  }

}
