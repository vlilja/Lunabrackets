import React from 'react';

import phrases from '../../Phrases';
import Icons from './Icons';

export default class PlayersToFinalsForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      initialized: false,
      toFinals: [],
      qualifierPlayers: [],
    };
    this.mapPlayers = this.mapPlayers.bind(this);
    this.renderPlayerLists = this.renderPlayerLists.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps() {
    if (this.props.league.players && this.props.league.qualifiers && this.props.league.qualifiers.matches) {
      this.mapPlayers();
      this.setState({ loading: false, initialized: true });
    }
  }

  submit() {
    const players = [];
    this.state.toFinals.forEach((p) => {
      players.push(p.id);
    });
    if (players.length === 4) {
      this.props.startFinals(players);
    } else {
      this.setState({ error: true });
    }
  }

  moveToFinals(id) {
    const { toFinals } = this.state;
    let { qualifierPlayers } = this.state;
    if (toFinals.length < 4) {
      toFinals.push(qualifierPlayers.find(p => p.id === id));
      qualifierPlayers = qualifierPlayers.filter(p => p.id !== id);
      this.setState({ toFinals, qualifierPlayers, error: false });
    }
  }

  moveToEligible(id) {
    let { toFinals } = this.state;
    const { qualifierPlayers } = this.state;
    qualifierPlayers.push(toFinals.find(p => p.id === id));
    toFinals = toFinals.filter(p => p.id !== id);
    this.setState({ toFinals, qualifierPlayers, error: false });
  }

  mapPlayers() {
    if (!this.state.initialized) {
      const { players } = this.props.league;
      const { matches } = this.props.league.qualifiers;
      const { toFinals, qualifierPlayers } = this.state;
      const matchKeys = ['B1', 'B2', 'L11', 'L12'];
      const filteredMatches = matches.filter((m) => {
        const key = matchKeys.find(k => m.key === k);
        if (key) {
          return true;
        }
        return false;
      });
      filteredMatches.forEach((m) => {
        const result = m.getResult();
        if (result) {
          toFinals.push(players.find(p => p.id === result.winner));
          if (m.key === 'L11' || m.key === 'L12') {
            qualifierPlayers.push(players.find(p => p.id === result.loser));
          }
        }
      });
      this.setState({ toFinals, qualifierPlayers });
    }
  }

  renderPlayerLists() {
    const { toFinals, qualifierPlayers } = this.state;
    let qualifierList = null;
    let finalsList = null;
    const qItems = [];
    qualifierPlayers.forEach((p) => {
      qItems.push(<li className="list-group-item" onDoubleClick={() => this.moveToFinals(p.id)} key={p.id}>{`${p.firstName} ${p.lastName}`}</li>);
    });
    qualifierList = (<ul className="list-group" key="q">
      {qItems}
    </ul>);
    const fItems = [];
    toFinals.forEach((p) => {
      fItems.push(<li className="list-group-item" onDoubleClick={() => this.moveToEligible(p.id)} key={p.id}>{`${p.firstName} ${p.lastName}`}</li>);
    });
    finalsList = (<ul key="f" className="list-group">
      {fItems}
    </ul>);
    return { q: qualifierList, f: finalsList };
  }

  render() {
    const { loading, error } = this.state;
    const lists = this.renderPlayerLists();
    return (<div className="col-xs-12 well">
      <h2>{phrases.playersToFinalsForm.heading}</h2>
      {loading ? <Icons type="LOADING" size="40px" /> :
      <div>
        <div className="col-xs-6">
          <div className="panel panel-default">
            <div className="panel-heading">
              {phrases.playersToFinalsForm.eligible}
            </div>
            <div className="panel-body">
              {lists.q}
            </div>
          </div>
        </div>
        <div className="col-xs-6">
          <div className="panel panel-default">
            <div className="panel-heading">
              {phrases.playersToFinalsForm.goingToFinals}
              <span className="right error-message">{error ? phrases.errorMessages.missingPlayers : ''}</span>
            </div>
            <div className="panel-body">
              {lists.f}
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
