import React from "react";
import _ from "lodash";
import Icon from "./Icons";
import phrases from "../../Phrases";

export default class LeaguePlayerForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      loading: true
    }
    this.mapList = this.mapList.bind(this);
    this.isActive = this.isActive.bind(this);
    this.setActive = this.setActive.bind(this);
    this.movePlayers = this.movePlayers.bind(this);
  }

  isActive(id) {
    var active = false;
    this.state.selected.forEach((item) => {
      if (item === id) {
        active = true;
      }
    });
    return active;
  }

  setActive(value) {
    var index = this.state.selected.findIndex((item) => {
      return item === value;
    });
    if (index === -1) {
      this.state.selected.push(value);
    } else {
      this.state.selected.splice(index, 1);
    }
    this.setState({
      ...this.state
    });
  }

  movePlayers(action) {
    var selected = [];
    var listFrom = action === 'add'
      ? this.props.availablePlayers
      : this.props.pickedPlayers;
    var listTo = action === 'add'
      ? this.props.pickedPlayers
      : this.props.availablePlayers;
    var listFull = false;
    this.state.selected.forEach((item) => {
      var index = listFrom.findIndex((player) => {
        return player.id === item.toString();
      })
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
      'firstName', 'lastName'
    ], ['asc', 'asc']);
    listTo = _.orderBy(listTo, [
      'firstName', 'lastName'
    ], ['asc', 'asc']);
    switch (action) {
      case 'add':
        this.setState({selected: selected});
        this.props.update({name: 'availablePlayers', value: listFrom});
        this.props.update({name: 'pickedPlayers', value: listTo});
        break;
      case 'remove':
        this.setState({selected: selected});
        this.props.update({name: 'availablePlayers', value: listTo});
        this.props.update({name: 'pickedPlayers', value: listFrom});
        break;
      default:
        break;
    };
  }

  mapList(list) {
    var item = 'list-group-item';
    var activeItem = 'list-group-item active';
    return list.map((player, idx) => <li className={this.isActive(player.id)
      ? activeItem
      : item} onClick={(e) => {this.setActive(player.id)}} key={idx}>{player.firstName}{' '}{player.lastName}
      <span style={{
        float: 'right'
      }}>{phrases.general.handicap}{': '}
        <span class="badge" style={{
          backgroundColor: 'grey'
        }}>{player.handicap}</span>
      </span>
    </li>)
  }

  render() {
    const mappedAvailablePlayers = this.mapList(this.props.availablePlayers);
    const mappedPickedPlayers = this.mapList(this.props.pickedPlayers);
    var badgeStyle = {
      float: 'right'
    };
    return (
      <div className="col-xs-12">
        <div className="col-lg-5 col-xs-12">
          <div class="well bs-component">
            <form class="form-horizontal">
              <fieldset>
                <legend>{phrases.leagueForm.availablePlayers}
                  <span className="badge" style={badgeStyle}>{this.props.availablePlayers.length}</span>
                </legend>
                <div class="form-group">
                  <div className="col-xs-12">
                    {this.props.loading ? <Icon type="LOADING" size='30px' message=""/> :
                    <ul className="list-group scrollable pointer">
                      {mappedAvailablePlayers}
                    </ul>
                    }
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-xs-12">
                    <button class="btn btn-default" onClick={this.props.back}>Back</button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        <div className="col-lg-2 col-xs-12">
          <div class="form-group">
            <div class="col-xs-12 margin-bottom">
              <button class="btn btn-primary col-xs-offset-2 col-xs-8" onClick={() => this.movePlayers('add')}>{phrases.leagueForm.add}</button>
            </div>
            <div class="col-xs-12 ">
              <button class="btn btn-primary col-xs-offset-2 col-xs-8" onClick={() => this.movePlayers('remove')}>{phrases.leagueForm.remove}</button>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xs-12">
          <div class="well bs-component">
            <div class="form-horizontal">
              <fieldset>
                <legend>{phrases.leagueForm.selectedPlayers}
                  <span className="badge" style={badgeStyle}>{this.props.pickedPlayers.length}{' / 32'}</span>
                </legend>
                <div class="form-group">
                  <div className="col-xs-12">
                    <ul className="list-group scrollable">
                      {mappedPickedPlayers}
                    </ul>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-xs-12 text-right">
                    {this.props.error
                      ? <span className="error-message">
                          <i class="fa fa-exclamation" aria-hidden="true"></i>
                          {phrases.errorMessages.missingPlayers}
                          {' '}
                        </span>
                      : ''}
                    <button class="btn btn-primary" onClick={this.props.next}>Next</button>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
