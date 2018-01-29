const _ = require('lodash');


function filterMutualMatches(players, matches) {
  const mutualMatches = [];
  for (let i = 0; i < players.length; i += 1) {
    for (let k = i + 1; k < players.length; k += 1) {
      mutualMatches.push(matches.find(match => ((players[i].id === match.playerOne.id && players[k].id === match.playerTwo.id) ||
          (players[k].id === match.playerOne.id && players[i].id === match.playerTwo.id))));
    }
  }
  return mutualMatches;
}

function rankTiedPlayers(players, matches, rank) {
  let rankedPlayers = [];
  const mutualMatches = filterMutualMatches(players, matches);
  const mutualWins = {};
  players.forEach((player) => {
    player.wins = 0;
    mutualWins[player.id] = player;
  });
  mutualMatches.forEach((match) => {
    const result = match.getResult();
    if (result) {
      mutualWins[result.winner].wins += 1;
    }
  });
  const grpByWins = _.groupBy(mutualWins, 'wins');
  const grpByWinsKeys = Object.keys(grpByWins);
  // Every one tied
  if (grpByWinsKeys.length === 1) {
    rank -= (players.length - 1);
    players.forEach((player) => {
      player.ranking = rank;
      rankedPlayers.push(player);
    });
  } else {
    grpByWinsKeys.forEach((key) => {
      if (grpByWins[key].length === 1) {
        grpByWins[key][0].ranking = rank;
        rankedPlayers.push(grpByWins[key][0]);
        rank -= 1;
      } else {
        rankedPlayers = rankedPlayers.concat(rankTiedPlayers(grpByWins[key], mutualMatches, rank));
        rank -= grpByWins[key].length;
      }
    });
  }
  return rankedPlayers;
}

module.exports = {

  determineRankings(groupMatches, groupPlayers) {
    let rank = groupPlayers.length;
    let rankedGroup = [];
    groupPlayers.forEach((player) => {
      player.wins = 0;
    });
    groupMatches.forEach((match) => {
      const result = match.getResult();
      if (result) {
        const player = groupPlayers.find(p => p.id === result.winner);
        player.wins += 1;
      }
    });
    const grpByWins = _.groupBy(groupPlayers, 'wins');
    const grpByWinsKeys = Object.keys(grpByWins);
    grpByWinsKeys.forEach((key) => {
      if (grpByWins[key].length > 1) {
        rankedGroup = rankedGroup.concat(rankTiedPlayers(grpByWins[key], groupMatches, rank));
        rank -= grpByWins[key].length;
      } else {
        grpByWins[key][0].ranking = rank;
        rankedGroup.push(grpByWins[key][0]);
        rank -= 1;
      }
    });
    return rankedGroup;
  },

  determinePlacements(group) {
    const groupByRank = _.groupBy(group.players, 'ranking');
    let toFinals = '';
    const toQualifiers = [];
    const toElimination = [];
    const undetermined = [];
    const groupByRankKeys = Object.keys(groupByRank);
    groupByRankKeys.forEach((key) => {
      if (key === '1') {
        if (groupByRank[key].length === 1) {
          ([toFinals] = groupByRank[key]);
        } else {
          undetermined.push(groupByRank[key]);
        }
      } else if (key > 1 && key < 6) {
        if (groupByRank[key].length === 1) {
          toQualifiers.push(groupByRank[key][0]);
        } else {
          undetermined.push(groupByRank[key]);
        }
      } else if (key > 5) {
        if (groupByRank[key].length === 1) {
          toElimination.push(groupByRank[key][0]);
        } else {
          undetermined.push(groupByRank[key]);
        }
      }
    });
    return {
      toFinals,
      toQualifiers,
      toElimination,
      undetermined,
    };
  },

};
