export default function reducer(state={
  view:''
}, action) {

  switch(action.type) {
    case "SHOW_HOME_SCREEN": {
      return {...state, view:''}
    }
    case "SHOW_TOURNAMENT_FORM": {
      return {...state, view:'tournamentForm'}
    }
    case "SHOW_MY_STATS": {
      return {...state, view:'myStats'}
    }
    case "SHOW_SEARCH_PLAYER": {
      return {...state, view:'searchPlayer'}
    }
  }

  return state;

}
