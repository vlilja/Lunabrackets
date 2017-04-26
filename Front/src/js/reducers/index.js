import { combineReducers } from "redux";

import tweets from "./tweetsReducer";
import user from "./userReducer";
import view from "./viewReducer";
import tournament from "./tournamentReducer";

export default combineReducers({
  tweets,
  user,
  view,
  tournament
})
