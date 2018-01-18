import React from 'react';
import phrases from '../../Phrases';

export default class LeagueMainForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.props.update({ name, value });
  }

  renderOptions() {
    const { seasons } = this.props;
    const options = [];
    seasons.forEach((season) => {
      options.push((<option key={season.id} value={season.id}>{season.name}</option>));
    });
    return options;
  }

  render() {
    const options = this.renderOptions();
    return (
      <div className="col-lg-8 col-lg-offset-1 col-sm-12">
        <div className="well bs-component">
          <form className="form-horizontal" autoComplete="off">
            <fieldset>
              <legend>{phrases.leagueForm.mainFormHeading}</legend>
              <div className="form-group">
                <span className="col-xs-2 control-label" htmlFor="name">{phrases.leagueForm.name}</span>
                <div className="col-xs-6">
                  <input className="form-control" name="leagueName" onChange={this.handleInputChange} value={this.props.leagueName} type="text" />
                  {this.props.error
                    ? <div className="error-message">
                      <i className="fa fa-exclamation" aria-hidden="true" /> {phrases.errorMessages.missingName}
                    </div>
                    : ''}
                </div>
              </div>
              <div className="form-group">
                <span className="col-xs-2 control-label">{phrases.leagueForm.game}</span>
                <div className="col-xs-10">
                  <div className="radio">
                    <label>
                      <input type="radio" name="game" id="eight" onChange={this.handleInputChange} value="1" checked={this.props.game === '1'} />
                      {phrases.general.games.eight}
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" name="game" id="nine" onChange={this.handleInputChange} value="2" checked={this.props.game === '2'} />
                      {phrases.general.games.nine}
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" name="game" id="ten" onChange={this.handleInputChange} value="3" checked={this.props.game === '3'} />
                      {phrases.general.games.ten}
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" name="game" id="straight" onChange={this.handleInputChange} value="4" checked={this.props.game === '4'} />
                      {phrases.general.games.straight}
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <span className="col-xs-2 control-label">{phrases.leagueForm.season}</span>
                <div className="col-xs-10">
                  <label htmlFor="season">
                    <select name="season" value={this.props.season} onChange={this.handleInputChange} multiple="" className="form-control" id="season">
                      {options}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-lg-4 col-lg-offset-8 text-right">
                <button className="btn btn-primary" onClick={this.props.next}>Next</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
