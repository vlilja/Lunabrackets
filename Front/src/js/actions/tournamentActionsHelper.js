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

    createDoubleEliminationMatches(tournamentSize) {

    }


}


export default helper;
