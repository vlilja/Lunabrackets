import React from "react";
import { connect } from "react-redux";
import {  fetchUser } from "../actions/userActions";
import Jumbotron from "./Jumbotron";
import Navbar from "./Navbar";
import Content from "./Content";
require('../../stylesheets/login.scss');

@connect((store) => {
    return {
        user: store.user.user,
        fetched: store.user.fetched
    };
})

export default class Layout extends React.Component {

    constructor(){
      super();
      this.state = {loginName: '', password: ''};
      this.handleInputChange = this.handleInputChange.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
    }

    handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    }
    submitLogin(event){
      event.preventDefault();
      var userDetails = {
        name:this.state.loginName,
        password:this.state.password
      }
      this.props.dispatch(fetchUser(userDetails));
    }

    render() {
        const {user, fetched}  = this.props;
        var test = true;
        if(!test) {
          return(
            <div>
            <Jumbotron />
            <div className="login-form">
              <h4>User login</h4>
            <form onSubmit={this.submitLogin}>
              <label>Name
              </label>
              <input value={this.state.loginName} name="loginName" onChange={this.handleInputChange} type="text"></input>
              <br />
              <label>Password</label>
              <input value={this.state.password} name="password" onChange={this.handleInputChange} type="text"></input>
              <br />
              <input id="submit" type="submit" value="Log in" />
            </form>
          </div>
        </div>);
        }
        else {
          return (<div>
            <Jumbotron />
            <Navbar />
            <div className = "lunaux-margin-left">
            <Content />
            </div>
          </div>);
        }
    }
}
