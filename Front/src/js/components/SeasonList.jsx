import React from 'react';
import { connect } from 'react-redux';
import { getSeasons, changeSeasonStatus } from '../actions/seasonActions';
import Icons from '../components/Icons';
import SeasonStatusForm from './SeasonStatusForm';

class SeasonList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.mapSeasons = this.mapSeasons.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.changeSeasonStatus = this.changeSeasonStatus.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSeasons());
  }

  changeSeasonStatus(seasonId, status) {
    this.props.dispatch(changeSeasonStatus(seasonId, status, this.props.user));
  }

  navigateTo(seasonId) {
    this.props.history.push(`${this.props.match.path}/${seasonId}`);
  }

  mapSeasons() {
    const mappedSeasons = { active: [], inactive: [] };
    let element;
    if (this.props.seasons) {
      this.props.seasons.forEach((season) => {
        if (season.active === '1') {
          mappedSeasons.active.push(<button key={season.id} onClick={() => { this.navigateTo(season.id); }} className="list-group-item clickable">{season.name}</button>);
        } else {
          mappedSeasons.inactive.push(<li key={season.id} className="list-group-item">{season.name}</li>);
        }
      });
      element = (<div>
        <h3>Active</h3>
        <ul className="list-group">{mappedSeasons.active}</ul>
        <h3>Inactive</h3>
        <ul className="list-group">{mappedSeasons.inactive}</ul>
      </div>);
    }
    return element;
  }

  render() {
    const seasons = this.mapSeasons();
    let form;
    if (this.props.user.admin === '1') {
      form = <SeasonStatusForm seasons={this.props.seasons} changeSeasonStatus={this.changeSeasonStatus} />;
    }
    return (
      <div>
        <h1>Seasons</h1>
        <div className="col-xs-12">
          {this.props.loading
            ? <Icons type="LOADING" size="40px" />
            : <div>
              <div className="col-lg-6 col-xs-12">
                {seasons}
              </div>
              <div className="col-lg-6 col-xs-12">
                {form}
              </div>
            </div>}
        </div>
      </div>
    );
  }

}

export default connect(store => ({
  user: store.user,
  seasons: store.season.seasons,
  season: store.season.selectedSeason,
  loading: store.season.loading,
}))(SeasonList);
