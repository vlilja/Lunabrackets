import { combineReducers } from "redux";

import tweets from "./tweetsReducer";
import user from "./userReducer";
import view from "./viewReducer";

export default combineReducers({
  tweets,
  user,
  view
})
