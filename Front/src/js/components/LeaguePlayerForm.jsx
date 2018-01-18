import React from 'react';
import _ from 'lodash';
import Icon from './Icons';
import phrases from '../../Phrases';

export default class LeaguePlayerForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      modalOpen: false,
      loading: true,
    };
    this.mapList = this.mapList.bind(this);
    this.isActive = this.isActive.bind(this);
    this.setActive = this.setActive.bind(this);
    this.movePlayers = this.movePlayers.bind(this);
  }

  setActive(value) {
    const index = this.state.selected.findIndex(item => item === value);
    if (index === -1) {
      this.state.selected.push(value);
    } else {
      this.state.selected.splice(index, 1);
    }
    this.setState({
      ...this.state,
    });
  }

  isActive(id) {
    let active = false;
    this.state.selected.forEach((item) => {
      if (item === id) {
        active = true;
      }
    });
    return active;
  }


  movePlayers(action) {
    const selected = [];
    let listFrom = action === 'add'
      ? this.props.availablePlayers
      : this.props.pickedPlayers;
    let listTo = action === 'add'
      ? this.props.pickedPlayers
      : this.props.availablePlayers;
    let listFull = false;
    this.state.selected.forEach((item) => {
      const index = listFrom.findIndex(player => player.id === item.toString());
      if (action === 'add') {
        if (listTo.length >= 32) {
          listFull = true;
        }
      }
      if (index > -1 && !listFull) {
        listTo.push(listFrom.splice(index, 1)[0]);
      } else {
        selected.push(item);
      }
    });
    listFrom = _.orderBy(listFrom, [
      'firstName', 'lastName',
    ], ['asc', 'asc']);
    listTo = _.orderBy(listTo, [
      'firstName', 'lastName',
    ], ['asc', 'asc']);
    switch (action) {
      case 'add':
        this.setState({ selected });
        this.props.update({ name: 'availablePlayers', value: listFrom });
        this.props.update({ name: 'pickedPlayers', value: listTo });
        break;
      case 'remove':
        this.setState({ selected });
        this.props.update({ name: 'availablePlayers', value: listTo });
        this.props.update({ name: 'pickedPlayers', value: listFrom });
        break;
      default:
        break;
    }
  }

  mapList(list) {
    const item = 'list-group-item';
    const activeItem = 'list-group-item active';
    return list.map((player, idx) => (<div
      role="button"
      tabIndex={idx}
      className={this.isActive(player.id)
      ? activeItem
      : item}
      onClick={() => { this.setActive(player.id); }}
      key={player.id}
    >{player.firstName}{' '}{player.lastName}
      <span style={{
        float: 'right',
      }}
      >{phrases.general.handicap}{': '}
        <span
          className="badge"
          style={{
          backgroundColor: 'grey',
        }}
        >{player.handicap}</span>
      </span>
    </div>));
  }

  render() {
    const mappedAvailablePlayers = this.mapList(this.props.availablePlayers);
    const mappedPickedPlayers = this.mapList(this.props.pickedPlayers);
    const badgeStyle = {
      float: 'right',
    };
    return (
      <div className="col-xs-12">
        <div className="col-lg-5 col-xs-12">
          <div className="well bs-component">
            <form className="form-horizontal">
              <fieldset>
                <legend>{phrases.leagueForm.availablePlayers}
                  <span className="badge" style={badgeStyle}>{this.props.availablePlayers.length}</span>
                </legend>
                <div className="form-group">
                  <div className="col-xs-12">
                    {this.props.loading ? <Icon type="LOADING" size="30px" message="" /> :
                    <ul className="list-group scrollable pointer">
                      {mappedAvailablePlayers}
                    </ul>
                    }
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <button className="btn btn-default" onClick={this.props.back}>Back</button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        <div className="col-lg-2 col-xs-12">
          <div className="form-group">
            <div className="col-xs-12 margin-bottom">
              <button className="btn btn-primary col-xs-offset-2 col-xs-8" onClick={() => this.movePlayers('add')}>{phrases.leagueForm.add}</button>
            </div>
            <div className="col-xs-12 ">
              <button className="btn btn-primary col-xs-offset-2 col-xs-8" onClick={() => this.movePlayers('remove')}>{phrases.leagueForm.remove}</button>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xs-12">
          <div className="well bs-component">
            <div className="form-horizontal">
              <fieldset>
                <legend>{phrases.leagueForm.selectedPlayers}
                  <span className="badge" style={badgeStyle}>{this.props.pickedPlayers.length}{' / 32'}</span>
                </legend>
                <div className="form-group">
                  <div className="col-xs-12">
                    <ul className="list-group scrollable">
                      {mappedPickedPlayers}
                    </ul>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12 text-right">
                    {this.props.error
                      ? <span className="error-message">
                        <i className="fa fa-exclamation" aria-hidden="true" />
                        {phrases.errorMessages.missingPlayers}
                        {' '}
                      </span>
                      : ''}
                    <button className="btn btn-primary" onClick={this.props.next}>Next</button>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
