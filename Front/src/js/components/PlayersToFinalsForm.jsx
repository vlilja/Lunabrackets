import React from 'react';

import phrases from '../../Phrases';
import Icons from './Icons';

export default class PlayersToFinalsForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: { grp: false, q: false },
      loading: true,
      initialized: false,
      toFinalsFromGroupStage: [],
      toFinalsFromQualifiers: [],
      qualifierPlayers: [],
      draggedItem: null,
    };
    this.mapPlayers = this.mapPlayers.bind(this);
    this.renderPlayerLists = this.renderPlayerLists.bind(this);
    this.moveToEligible = this.moveToEligible.bind(this);
    this.moveToFinalsFromQualifiers = this.moveToFinalsFromQualifiers.bind(this);
    this.moveToFinalsFromGroupStage = this.moveToFinalsFromGroupStage.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.getMatches();
  }

  componentWillReceiveProps() {
    if (this.props.league.players && this.props.league.qualifiers && this.props.league.qualifiers.matches && this.props.league.finals && this.props.league.finals.matches) {
      this.mapPlayers();
      this.setState({ loading: false, initialized: true });
    }
  }

  submit() {
    const players = { groupStage: [], qualifiers: [] };
    const { error } = this.state;
    this.state.toFinalsFromGroupStage.forEach((p) => {
      players.groupStage.push(p.id);
    });
    this.state.toFinalsFromQualifiers.forEach((p) => {
      players.qualifiers.push(p.id);
    });
    let valid = true;

    if (players.groupStage.length !== 4) {
      error.grp = true;
      valid = false;
    }
    if (players.qualifiers.length !== 4) {
      error.q = true;
      valid = false;
    }
    if (valid) {
      this.props.startFinals(players);
    } else {
      this.setState({ error });
    }
  }

  drag(id) {
    this.setState({ error: { grp: false, q: false }, draggedItem: id });
  }

  moveToFinalsFromGroupStage() {
    let { qualifierPlayers, draggedItem } = this.state;
    const { toFinalsFromGroupStage } = this.state;
    const selectedPlayer = qualifierPlayers.find(p => p.id === draggedItem);
    if (selectedPlayer && toFinalsFromGroupStage.length < 4) {
      toFinalsFromGroupStage.push(selectedPlayer);
      qualifierPlayers = qualifierPlayers.filter(p => p.id !== draggedItem);
      draggedItem = null;
      this.setState({
        toFinalsFromGroupStage, qualifierPlayers, error: { grp: false, q: false }, draggedItem,
      });
    } else {
      this.setState({
        draggedItem: null,
      });
    }
  }

  moveToFinalsFromQualifiers() {
    let { qualifierPlayers, draggedItem } = this.state;
    const { toFinalsFromQualifiers } = this.state;
    const selectedPlayer = qualifierPlayers.find(p => p.id === draggedItem);
    if (selectedPlayer && toFinalsFromQualifiers.length < 4) {
      toFinalsFromQualifiers.push(selectedPlayer);
      qualifierPlayers = qualifierPlayers.filter(p => p.id !== draggedItem);
      draggedItem = null;
      this.setState({
        toFinalsFromQualifiers, qualifierPlayers, error: { grp: false, q: false }, draggedItem,
      });
    } else {
      this.setState({
        draggedItem: null,
      });
    }
  }

  moveToEligible() {
    let { toFinalsFromGroupStage, toFinalsFromQualifiers, draggedItem } = this.state;
    const { qualifierPlayers } = this.state;
    let selectedPlayer = toFinalsFromQualifiers.find(p => p.id === draggedItem);
    if (!selectedPlayer) {
      selectedPlayer = toFinalsFromGroupStage.find(p => p.id === draggedItem);
    }
    qualifierPlayers.push(selectedPlayer);
    toFinalsFromQualifiers = toFinalsFromQualifiers.filter(p => p.id !== draggedItem);
    toFinalsFromGroupStage = toFinalsFromGroupStage.filter(p => p.id !== draggedItem);
    draggedItem = null;
    this.setState({
      toFinalsFromGroupStage, toFinalsFromQualifiers, qualifierPlayers, error: { grp: false, q: false }, draggedItem,
    });
  }

  mapPlayers() {
    if (!this.state.initialized) {
      const { players } = this.props.league;
      const qualifierMatches = this.props.league.qualifiers.matches;
      const finalsMatches = this.props.league.finals.matches;
      const { toFinalsFromQualifiers, qualifierPlayers } = this.state;
      const matchKeys = ['B1', 'B2', 'L9', 'L10', 'L11', 'L12'];
      const filteredQualifierMatches = qualifierMatches.filter((m) => {
        const key = matchKeys.find(k => m.key === k);
        if (key) {
          return true;
        }
        return false;
      });
      const toFinalsFromGroupStage = [];
      finalsMatches.forEach((m) => {
        if (Number(m.key) < 5) {
          const player = players.find(p => p.id === m.playerOne.id);
          if (player) {
            toFinalsFromGroupStage.push(player);
          }
        }
      });
      filteredQualifierMatches.forEach((m) => {
        const result = m.getResult();
        if (result) {
          if (m.key.match(/(B.)|(L11)|(L12)/)) {
            const player = players.find(p => p.id === result.winner);
            if (player) {
              toFinalsFromQualifiers.push(players.find(player));
            }
          }
          if (m.key.match(/L./)) {
            const player = players.find(p => p.id === result.loser);
            if (player) {
              qualifierPlayers.push(player);
            }
          }
        }
      });
      this.setState({ toFinalsFromGroupStage, toFinalsFromQualifiers, qualifierPlayers });
    }
  }

  renderPlayerLists() {
    const { toFinalsFromGroupStage, toFinalsFromQualifiers, qualifierPlayers } = this.state;
    let finalsListFromGroupStage = null;
    let finalsListFromQualifiers = null;
    let qualifierList = null;
    const qItems = [];
    qualifierPlayers.forEach((p) => {
      qItems.push(<li className="list-group-item" draggable="true" onDragStart={() => { this.drag(p.id); }} onDoubleClick={() => this.moveToFinals(p.id)} key={p.id}>{`${p.firstName} ${p.lastName}`}</li>);
    });
    qualifierList = (<ul className="list-group" key="q">
      {qItems}
    </ul>);
    const fromGroupStageItems = [];
    toFinalsFromGroupStage.forEach((p) => {
      fromGroupStageItems.push(<li className="list-group-item" draggable="true" onDragStart={() => { this.drag(p.id); }} onDoubleClick={() => this.moveToEligible(p.id)} key={p.id}>{`${p.firstName} ${p.lastName}`}</li>);
    });
    finalsListFromGroupStage = (<ul key="fg" className="list-group">
      {fromGroupStageItems}
    </ul>);
    const fromQualifiersItems = [];
    toFinalsFromQualifiers.forEach((p) => {
      fromQualifiersItems.push(<li className="list-group-item" draggable="true" onDragStart={() => { this.drag(p.id); }} onDoubleClick={() => this.moveToEligible(p.id)} key={p.id}>{`${p.firstName} ${p.lastName}`}</li>);
    });
    finalsListFromQualifiers = (<ul key="f" className="list-group">
      {fromQualifiersItems}
    </ul>);
    return { q: qualifierList, fg: finalsListFromGroupStage, fq: finalsListFromQualifiers };
  }

  render() {
    const { loading, error } = this.state;
    const lists = this.renderPlayerLists();
    return (<div className="col-xs-12 well">
      <h2>{phrases.playersToFinalsForm.heading}</h2>
      {loading ? <Icons type="LOADING" size="40px" /> :
      <div>
        <div className="col-xs-12">
          <p>{phrases.playersToFinalsForm.lead}</p>
        </div>
        <div className="col-xs-6">
          <div className="panel panel-default" onDragOver={(e) => { e.preventDefault(); }} onDrop={this.moveToEligible} name="qualifierPlayers">
            <div className="panel-heading">
              {phrases.playersToFinalsForm.eligible}
            </div>
            <div className="panel-body">
              {lists.q}
            </div>
          </div>
        </div>
        <div className="col-xs-6">
          <div className="col-xs-12">
            <div className="panel panel-default" name="toFinals" onDragOver={(e) => { e.preventDefault(); }} onDrop={this.moveToFinalsFromGroupStage}>
              <div className="panel-heading">
                {phrases.playersToFinalsForm.fromGroupStage}
                <span className="right error-message">{error.grp ? phrases.errorMessages.missingPlayers : ''}</span>
              </div>
              <div className="panel-body">
                {lists.fg}
              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="panel panel-default" name="toFinals" onDragOver={(e) => { e.preventDefault(); }} onDrop={this.moveToFinalsFromQualifiers}>
              <div className="panel-heading">
                {phrases.playersToFinalsForm.fromQualifiers}
                <span className="right error-message">{error.q ? phrases.errorMessages.missingPlayers : ''}</span>
              </div>
              <div className="panel-body">
                {lists.fq}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <button className="btn btn-primary" onClick={this.submit}>
            {phrases.endQualifiersForm.startFinals}
          </button>
        </div>
      </div>
    }
    </div>);
  }
}
