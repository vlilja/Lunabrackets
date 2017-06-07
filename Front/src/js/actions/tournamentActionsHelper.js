import Match from "../classes/match";

var helper = {

    setMatchOrder: function(tournamentSize, matches) {
        console.log(matches);
        var bracketSize = tournamentSize / 2;
        var matchIdx = 0;
        for (var i = 0; i < matches.length; i++) {
            var nextMatchNumber = this.calculateNextMatch(bracketSize, matches[matchIdx].number);
            matches[matchIdx].nextMatch = nextMatchNumber;
            matchIdx++;
        }
    },

    calculateNextMatch: function(bracketSize, matchNumber) {
        var nextMatchId = matchNumber + bracketSize - (matchNumber / 2);
        return Math.ceil(nextMatchId);
    },

    convertJSONtoMatches: function(result) {
        console.log(result.data)
        var matches = [];
        var match;
        for (var outer in result.data) {
            match = new Match();
            for (var inner in result.data[outer]) {
                match[inner] = result.data[outer][inner];
            }
            matches.push(match);
        }
        return matches;
    },

    createDoubleEliminationMatches(tournamentSize, participants) {
        var winnerBracketSize = tournamentSize;
        var loserBracketSize = tournamentSize - 2;
        var winnerSideMatches = [];
        var loserSideMatches = [];
        var round = 0;
        for (var i = 0; i < winnerBracketSize; i++) {
          var playerOne = null;
          var playerTwo = null;
          if (participants.length > 0) {
              playerOne = participants.pop();
              playerTwo = participants.pop();
          }
            winnerSideMatches.push(new Match(null, i + 1, playerOne, playerTwo, 0, 0, 0));
        }
        for (var i = 0; i < loserBracketSize; i++) {
            loserSideMatches.push(new Match(null, i + 1, null, null, 0, 0, 0));
        }

        winnerSideMatches.sort(function(a, b) {
            return b.number - a.number;
        })
        loserSideMatches.sort(function(a, b) {
            return b.number - a.number;
        })
        this.setMatchOrder(tournamentSize, winnerSideMatches)

        // Winner side
        var winnerRounds = [];
        var round = [];
        var idx = 1;
        var splitter = winnerSideMatches.length / 2;
        while (winnerSideMatches.length > 0) {
            round.push(winnerSideMatches.pop());
            if (idx === splitter) {
                splitter /= 2;
                idx = 0;
                winnerRounds.push(round);
                round = [];
            }
            idx++;
        }
        winnerRounds.push(round);

        // Loser side
        var loserRounds = [];
        round = [];
        var idx = 1;
        var k = 1;
        var splitter = tournamentSize / 2;
        while (loserSideMatches.length > 0) {
            round.push(loserSideMatches.pop());
            if (idx === splitter / 2) {
                idx = 0;
                loserRounds.push(round);
                round = [];
            }
            if (k === splitter) {
                k = 0;
                splitter /= 2;
            }
            k++;
            idx++;
        }

        //init first round
        var idx = 0;
        var pointer = 0;
        while (idx < winnerRounds[0].length) {
            winnerRounds[0][idx].setLoserNextMatch(loserRounds[0][pointer].number);
            if (idx !== 0 && idx % 2) {
                pointer++;
            }
            idx++;
        }

        //Set loserside
        idx = 0;
        while (idx < loserRounds.length - 1) {
            if (loserRounds[idx].length === loserRounds[idx + 1].length) {
                for (var i = 0; i < loserRounds[idx].length; i++) {
                    loserRounds[idx][i].setNextMatch(loserRounds[idx + 1][i].number);
                }
            } else {
                var everyOther = 0;
                for (var i = 0; i < loserRounds[idx].length; i++) {
                    loserRounds[idx][i].setNextMatch(loserRounds[idx + 1][everyOther].number);
                    if (i !== 0 && i % 2) {
                        everyOther++;
                    }
                }
            }
            idx++;
        }
        //Set last loserbracket match
        loserRounds[loserRounds.length - 1][0].setNextMatch(winnerRounds[winnerRounds.length - 1][0].number);

        //Set winnerside loser matches
        idx = 1;
        var odd = 1;
        while (idx < winnerRounds.length - 1) {
            var currentRound = winnerRounds[idx];
            var index = 0;
            loserRounds[odd].sort(function(a, b) {
                return b.number - a.number;
            })
            while (index < currentRound.length) {
                currentRound[index].setLoserNextMatch(loserRounds[odd][index].number);
                index++;
            }
            idx++;
            odd += 2;
        }
        var winnerSide = [];
        var loserSide = [];
        for(var key in winnerRounds){
          winnerSide = winnerSide.concat(winnerRounds[key]);
        }
        for(var key in loserRounds){
        loserSide = loserSide.concat(loserRounds[key]);
        }
        return {
          winnerSide:winnerSide,
          loserSide:loserSide
        }
    }


}


export default helper;
