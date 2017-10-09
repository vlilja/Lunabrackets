import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
//import { routerReducer, syncHistoryWithStore } from 'react-router-redux';
import App from "./components/App";
import Navbar from "./components/Navbar";
import Frontpage from "./pages/Frontpage";
import Tournaments from "./pages/Tournaments";
import Players from "./pages/Players";
import Leagues from "./pages/Leagues";
import LeagueForm from "./pages/LeagueForm";
import LeagueList from "./components/LeagueList";
import LeagueDetails from "./pages/LeagueDetails";
import NoMatch from "./pages/NoMatch"
import store from "./store";

const app = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
  <Router>
    <div>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/" component={Frontpage}></Route>
        <Route path="/tournaments" component={Tournaments}></Route>
        <Route path="/players" component={Players}></Route>
        <Route path="/leagues" component={Leagues}></Route>
        <Route path="/new-league" component={LeagueForm}></Route>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
</Provider>, app);
