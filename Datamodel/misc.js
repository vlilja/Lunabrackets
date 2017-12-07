League() {
  this.name = '';
  this.gameType = '';
  this.players = [];
  this.stage = '';
},

Match() {
  this.raceTo = '';
  this.playerOne = {
    details : '',
    score : ''
  }
  this.playerTwo = {
    details : '',
    score : ''
  }
},

Player () {
  this.id='';
  this.firstName='';
  this.lastName='';
  this.handiCap=''
}

}
