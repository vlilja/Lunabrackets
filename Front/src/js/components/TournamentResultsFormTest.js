import chai from 'chai';
const {expect} = chai

const validate = (pickedPlayers) => {
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
  it('Returns undefined for invalid input', () => {
    const pickedPlayers = [
      { id: 0, ranking: 0},
      { id: 1, ranking: 1},
      { id: 2, ranking: 2}
    ]

    expect(validate(pickedPlayers)).to.be.undefined
  })

  it('Returns empty array when given an empty array', () => {
    expect(validate([])).to.eql([])
  })
});
