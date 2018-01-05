import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import user from './userReducer';
import player from './playerReducer';
import league from './leagueReducer';
import season from './seasonReducer';

export default combineReducers({
  user,
  player,
  league,
  season,
  routing: routerReducer,
});
