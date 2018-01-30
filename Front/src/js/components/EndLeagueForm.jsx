import React from 'react';

import Icons from './Icons';
import phrases from '../../Phrases';

export default class EndLeagueForm extends React.Component {

  constructor(props) {
    super(props);
    this.checkIfFinished = this.checkIfFinished.bind(this);
  }

  componentWillMount() {
    this.props.getMatches();
  }

  checkIfFinished() {
    let finished = false;
    if (this.props.finals && this.props.finals.matches && this.props.elimination && this.props.elimination.matches) {
      finished = true;
      this.props.finals.matches.forEach((m) => {
        const result = m.getResult();
        if (!result) {
          finished = false;
        }
      });
      this.props.elimination.matches.forEach((m) => {
        const result = m.getResult();
        if (!result) {
          finished = false;
        }
      });
    }
    return finished;
  }

  render() {
    let loading = true;
    if (this.props.finals && this.props.finals.matches && this.props.elimination && this.props.elimination.matches) {
      loading = false;
    }
    const finished = this.checkIfFinished();
    return (<div className="col-xs-12">
      <h2>{phrases.endLeagueForm.heading}</h2>
      {loading ? <Icons type="LOADING" size="40px" /> : <div>
        {finished ? <button className="btn btn-primary" onClick={this.props.finishLeague}>{phrases.endLeagueForm.submit}</button> :
        <p className="lead">{phrases.endLeagueForm.incompleteMatches}</p>}
      </div>}
    </div>);
  }
}
