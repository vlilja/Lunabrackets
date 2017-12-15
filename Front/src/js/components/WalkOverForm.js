import React from "react";
import phrases from "../../Phrases"

export default class WalkOverForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  update() {

  }

  render() {
    const player = this.props.player;
    return (
      <div class="col-xs-12">
        <div class="row">
          <div class="col-xs-6">
            <h2>{phrases.walkOverForm.heading}</h2>
          </div>
          <div class="col-xs-offset-5 col-xs-1">
            <i class="fa fa-window-close" style={{
              fontSize: '30px'
            }} aria-hidden="true" onClick={this.props.closeModal}></i>
          </div>
        </div>
        <div class="col-xs-12">
          <h3>{phrases.walkOverForm.message + ' ' + player.firstName + ' ' + player.lastName + '?'}</h3>
        </div>
        <div class="col-xs-12 margin-top-double">
            <div class="col-xs-2 col-xs-offset-4">
              <button class="btn btn-primary" onClick={this.update}>{phrases.general.yes}</button>
            </div>
            <div class="col-xs-2">
              <button class="btn btn-default" onClick={this.props.closeModal}>{phrases.general.no}</button>
            </div>
        </div>
      </div>
    )
  }

}
