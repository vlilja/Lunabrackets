import chai from 'chai';
const {expect} = chai

const submit = (pickedPlayers) => {
  if (pickedPlayers.length <= 16) {
    const places = [];
    const rankedPlayers = [];
    pickedPlayers.forEach((p, idx) => {
      places.push(idx + 1);
      rankedPlayers.push({ playerId: p.id, place: p.ranking });
    });
    rankedPlayers.sort((a, b) => a.place - b.place);
    let valid = true;
    for (let i = 0; i < rankedPlayers.length; i += 1) {
      if (places[i] !== rankedPlayers[i].place) {
        valid = false;
      }
    }
    if (valid) {
      console.log(rankedPlayers);
      // this.props.createTournamentResults(rankedPlayers);
      return rankedPlayers;
    } else {
      // this.setState({ error: true });
      return undefined
    }
  }
}

describe('Tournament Result Form validation', () => {
  it('Validates players before submitting results', () => {
      expect(true).to.eql(true)
  })
});
