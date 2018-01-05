


module.exports =  function Season(id, name, leagues, active) {
      this.id = id || '';
      this.name = '' || name;
      this.leagues = leagues || [];
      this.setLeagues = function(leagues) {
        if(leagues instanceof Array) {
          this.leagues = leagues;
        }
      }
      this.active = active || 0;
}
