export default function Bracket(wsMatches, lsMatches) {
    this.wsMatches = wsMatches;
    this.lsMatches = lsMatches;
    this.updateMatch = function(match) {
        var winner = (match.playerOneScore > match.playerTwoScore) ? match.playerOne : match.playerTwo;
        var loser = (match.playerOneScore > match.playerTwoScore) ? match.playerTwo : match.playerOne;
        if (match.side === 'winnerSide') {
            for (var key in wsMatches) {
                if (wsMatches[key].number === match.number) {
                    wsMatches[key] = match;
                }
                if (wsMatches[key].number === match.nextMatch) {
                    if (match.number % 2 === 0) {
                        wsMatches[key].playerTwo = winner;
                    } else {
                        wsMatches[key].playerOne = winner;
                    }
                }
            }
        }
    }

}
