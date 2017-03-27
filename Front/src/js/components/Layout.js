import React from "react";
import { connect } from "react-redux";
import {  fetchUser } from "../actions/userActions";

@connect((store) => {
    return {
        user: store.user.user,
        fetched: store.user.fetched
    };
})

/*
function mapStateToProps(store) {
  return {
      user: store.user.user
  };
}
*/
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
      console.log("state" + this.state);
      var userDetails = {
        name:this.state.loginName,
        password:this.state.password
      }
      console.log(userDetails);
      this.props.dispatch(fetchUser(userDetails));
    }

    render() {
        const {user, fetched}  = this.props;
        console.log(this.props);
        if(!fetched) {
          return (<div>
            <form onSubmit={this.submitLogin}>
              <label>Name
              <input value={this.state.loginName} name="loginName" onChange={this.handleInputChange} type="text"></input>
              </label>
              <br />
              <label>Password
              <input value={this.state.password} name="password" onChange={this.handleInputChange} type="text"></input>
              </label>
              <br />
              <input type="submit" value="Log in" />
            </form>
          </div>);
        }
        else {
          return (<div>
            <h1>Welcome to Lunabracket {name}</h1>
          </div>)
        }
    }
}

//export default connect(mapStateToProps)(Layout);
