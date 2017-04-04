const view =  {
  showHomeScreen: function(){
    return {
      type:'SHOW_HOME_SCREEN',
      payload:{}
      }
  },

  showTournamentForm: function(){
    return {
      type:'SHOW_TOURNAMENT_FORM',
      payload:{}
      }
    },

  showMyStats: function() {
    return {
      type:'SHOW_MY_STATS',
      payload:{}
    }
  },

  showSearchPlayer: function() {
    return {
      type:'SHOW_SEARCH_PLAYER',
      payload:{}
    }
  }

}


export default view;
