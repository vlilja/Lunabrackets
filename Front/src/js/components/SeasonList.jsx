import React from 'react';
import { connect } from 'react-redux';
import { getSeasons } from '../actions/seasonActions';
import Icons from '../components/Icons';

class SeasonList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.mapSeasons = this.mapSeasons.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSeasons());
  }

  navigateTo(seasonId) {
    this.props.history.push(`${this.props.match.path}/${seasonId}`);
  }

  mapSeasons() {
    const mappedSeasons = [];
    if (this.props.seasons) {
      this.props.seasons.sort((a, b) => Number(b.active) - Number(a.active));
      mappedSeasons.push(<h3 key="active">Active</h3>);
      this.props.seasons.forEach((season, idx) => {
        if (idx === 0) {
          mappedSeasons.push(<button key={season.id} onClick={() => { this.navigateTo(season.id); }} className="list-group-item active clickable">{season.name}</button>);
          mappedSeasons.push(<h3 key="inactive">Inactive</h3>);
        } else {
          mappedSeasons.push(<li key={season.id} className="list-group-item clickable">{season.name}</li>);
        }
      });
    }
    return <ul className="list-group">{mappedSeasons}</ul>;
  }

  render() {
    const seasons = this.mapSeasons();
    return (
      <div className="container">
        <h1>Seasons</h1>
        <div className="col-xs-12 col-lg-6">
          {this.props.loading
            ? <Icons type="LOADING" size="40px" />
            : seasons}
        </div>
      </div>
    );
  }

}

export default connect(store => ({
  seasons: store.season.seasons,
  season: store.season.selectedSeason,
  loading: store.season.loading,
}))(SeasonList);
