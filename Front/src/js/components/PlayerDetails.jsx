import React from 'react';

export default class PlayerDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { player } = this.props;
    if (!player) {
      return <div />;
    }
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
    );
  }

}
