import React from "react";
import phrases from "../../Phrases";

export default class LeagueMainForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value
    this.props.update({name: name, value: value});
  }

  render() {
    return (
      <div className="col-lg-8 col-lg-offset-1 col-sm-12">
        <div class="well bs-component">
          <form class="form-horizontal" autoComplete="off">
            <fieldset>
              <legend>{phrases.leagueForm.mainFormHeading}</legend>
              <div className="form-group">
                <label className="col-xs-2 control-label" for="name">{phrases.leagueForm.name}</label>
                <div className="col-xs-6">
                  <input class="form-control" name="leagueName" onChange={this.handleInputChange} value={this.props.leagueName} type="text"></input>
                  {this.props.error
                    ? <div className="error-message">
                        <i class="fa fa-exclamation" aria-hidden="true"></i> {phrases.errorMessages.missingName}
                      </div>
                    : ''}
                </div>
              </div>
              <div className="form-group">
                <label className="col-xs-2 control-label" for="game">{phrases.leagueForm.game}</label>
                <div className="col-xs-10">
                  <div class="radio">
                    <label>
                    <input type="radio" name="game" id="eight" onChange={this.handleInputChange} value='1' checked={this.props.game === '1'}/>
                      {phrases.general.games.eight}
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                    <input type="radio" name="game" id="nine" onChange={this.handleInputChange} value='2' checked={this.props.game === '2'}/>
                      {phrases.general.games.nine}
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                    <input type="radio" name="game" id="ten" onChange={this.handleInputChange} value='3' checked={this.props.game === '3'}/>
                      {phrases.general.games.ten}
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                    <input type="radio" name="game" id="straight" onChange={this.handleInputChange} value='4' checked={this.props.game === '4'}/>
                      {phrases.general.games.straight}
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-lg-offset-8 text-right">
                <button class="btn btn-primary" onClick={this.props.next}>Next</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}
