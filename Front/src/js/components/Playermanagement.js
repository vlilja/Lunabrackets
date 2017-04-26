import React from "react";
import {connect} from "react-redux";
import {fetchUsers} from "../actions/userActions";
import {fetchParticipants, addParticipant} from "../actions/tournamentActions";

@connect((store) => {
    return {users: store.user.users, participants: store.tournament.selectedTournamentParticipants};
})

export default class Playermanagement extends React.Component {

    constructor(props) {
        super(props);
        this.addParticipant = this.addParticipant.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchUsers());
        this.props.dispatch(fetchParticipants(this.props.tournamentId));
    }

    addParticipant(playerId) {
        var participants = this.props.participants;
        if (participants.length < this.props.tournamentSize) {
            for (var i = 0; i < participants.length; i++) {
                if (participants[i].id === playerId) {
                    console.log('Match');
                    return false;
                }
            }
            this.props.dispatch(addParticipant(this.props.tournamentId, playerId));
        }
    }

    render() {
        console.log(this.props);
        const mappedUsers = this.props.users.map((user, index) => <li key={index} value={user.id} onClick={() => {
            this.addParticipant(user.id)
        }}>{user.firstName} {user.lastName}</li>);
        const mappedParticipants = this.props.participants.map((participant, index) => <li key={index} value={participant.id}>{participant.firstName} {participant.lastName}
            <span style={{
                float: 'right'
            }}>Handicap:<span className="badge">{participant.handicap}</span>
            </span>
        </li>)
        var listStyle = {
          maxHeight: '600px',
          overflowY: 'auto'
        }
        return (
            <div className="row">
                <div className="align-top col-md-6">
                    <h3>Players:</h3>
                    <ul className="list-group" style={listStyle}>
                        {mappedUsers}
                    </ul>
                </div>
                <div className="align-top col-md-6">
                    <h3>Participants:</h3>
                    <ul className="list-group" style={listStyle}>
                        {mappedParticipants}
                    </ul>
                </div>
            </div>
        )
    }

}
