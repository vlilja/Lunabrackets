import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import Layout from "./components/Layout";
import store from "./store";
require('../stylesheets/base.scss');

const app = document.getElementById('app');
ReactDOM.render(<Provider store={store}>
  <Layout />
  </Provider>, app);
