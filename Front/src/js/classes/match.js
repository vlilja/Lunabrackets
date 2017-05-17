

export default function Match(id, number, playerOne, playerTwo, nextMatch, loserNextMatch, raceTo){
    this.id = id;
    this.number= number;
    this.playerOne = playerOne;
    this.playerOneScore = 0;
    this.playerTwo = playerTwo;
    this.playerTwoScore = 0;
    this.nextMatch = nextMatch;
    this.loserNextMatch = loserNextMatch;
    this.setNextMatch = function(val){this.nextMatch = val};
    this.setLoserNextMatch = function(val){this.loserNextMatch = val};
    this.raceTo = raceTo;
    this.complete = 'N';
    this.side = '';
    this.winner = '';
    this.setPlayerOneScore = function(val){
      this.playerOneScore = val;
    }
    this.setPlayerTwoScore = function(val) {
      this.playerTwoScore = val;
    }
    this.completeMatch = function(){
      if(this.playerOneScore === this.raceTo){
        this.winner = this.playerOne;
      }
      else if(this.playerTwoScore === this.raceTo)
      {
        this.winner = this.playerTwo;
      }
      this.complete = 'Y';
    }
}
