


module.exports =  function Season(name, leagues) {
      this.name = '' || name;
      this.leagues = leagues || [];
      this.setLeagues = function(leagues) {
        if(leagues instanceof Array) {
          this.leagues = leagues;
        }
      }
      this.standings = ''
}
