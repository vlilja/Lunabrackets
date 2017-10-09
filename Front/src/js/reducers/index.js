import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux'
import user from "./userReducer";
import player from "./playerReducer";
import view from "./viewReducer";
import tournament from "./tournamentReducer";
import league from "./leagueReducer";

export default combineReducers({
  user,
  player,
  view,
  tournament,
  league,
  routing: routerReducer
})
