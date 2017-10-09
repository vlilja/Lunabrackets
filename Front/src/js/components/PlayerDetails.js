import React from "react";

export default class PlayerDetails extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log('rendering');
    console.log(this.props.player);
    const player = this.props.player;
    console.log(player);
    if (!player) {
      return <div></div>
    } else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            {player.firstName}{' '} {player.lastName}
          </div>
          <div className="panel-body">
            <div>
              Nickname: {player.nickName}
            </div>
            <div>
              Handicap : {player.handicap}</div>
          </div>
        </div>
      )
    }
  }

}
