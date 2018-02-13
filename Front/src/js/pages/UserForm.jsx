import React from 'react';
import { connect } from 'react-redux';

import { getFacebookUserDetails } from '../actions/loginActions';
import { createUser } from '../actions/userActions';
import Icons from '../components/Icons';
import phrases from '../../Phrases';

class UserForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getFacebookUserDetails());
  }


  submit() {
    const user = {
      fbId: this.props.user.fbId,
      firstName: this.props.user.fb.details.firstName,
      lastName: this.props.user.fb.details.lastName,
      nickName: this.state.nickName,
    };
    this.props.dispatch(createUser(user));
  }

  handleChange(e) {
    this.setState({ nickName: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <h2>{phrases.userForm.heading}</h2>
        <p className="lead">{phrases.userForm.infotext}</p>
        {this.props.user.fb.details ?
          <div className="col-xs-12 col-lg-4 well">
            <div className="form-group">
              <div className="col-xs-12">
                <label htmlFor="firstname">
                  {phrases.userForm.firstName}
                  <input className="form-control" type="text" name="firstname" readOnly value={this.props.user.fb.details.firstName} />
                </label>
              </div>
              <div className="col-xs-12">
                <label htmlFor="lastname">
                  {phrases.userForm.lastName}
                  <input className="form-control" type="text" name="lastname" readOnly value={this.props.user.fb.details.lastName} />
                </label>
              </div>
              <div className="col-xs-12">
                <label htmlFor="nickname">
                  {phrases.userForm.nickName}
                  <input className="form-control" type="text" name="lastname" onChange={this.handleChange} value={this.state.nickName} />
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-12 margin-to">
                <button onClick={this.submit} className="btn btn-primary">{phrases.general.submit}</button>
              </div>
            </div>
          </div>
        : <Icons type="LOADING" size="40px" />}
      </div>);
  }

}

export default connect(store => ({
  user: store.user,
}))(UserForm);
