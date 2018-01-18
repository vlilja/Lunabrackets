import React from 'react';
import { connect } from 'react-redux';
import { createSeason } from '../actions/seasonActions';
import Icons from '../components/Icons';
import phrases from '../../Phrases';


class SeasonForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      showMessage: false,
      error: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(props) {
    if (!props.loading || props.loading) {
      this.setState({ showMessage: true });
      setTimeout(() => {
        this.setState({ showMessage: false, name: '' });
      }, 1500);
    }
  }

  handleInputChange(event) {
    const { value } = event.target;
    this.setState({ name: value, error: false });
  }

  submit(e) {
    e.preventDefault();
    const { name } = this.state;
    if (name && name.length > 0) {
      this.props.dispatch(createSeason({ name }));
    } else {
      this.setState({ error: true });
    }
  }

  renderModal() {
    let modal;
    if (this.props.loading) {
      modal = (<div className="modal-back-ground">
        <div className="col-xs-4 col-xs-offset-4 small-modal dialog">
          <Icons type="LOADING" size="40px" />
        </div>
      </div>);
    } else if (this.props.message) {
      modal = (<div className={this.state.showMessage ? 'modal-back-ground fade show' : 'modal-back-ground fade'}>
        <div className={this.state.showMessage
          ? 'col-xs-4 col-xs-offset-4 small-modal dialog fade show'
          : 'col-xs-4 col-xs-offset-4 small-modal dialog fade'}
        ><Icons
          type={this.props.error
        ? 'ERROR'
        : 'SUCCESS'}
          size="40px"
          message={this.props.message}
        /></div>
      </div>);
    }
    return modal;
  }

  render() {
    const modal = this.renderModal();
    return (<div className="container">
      <div className="col-xs-12 col-lg-6">
        <h2>{phrases.seasonForm.heading}</h2>
        {modal}
        <form className="form-horizontal" autoComplete="off">
          <fieldset>
            <div className="well bs-component">
              <div className="form-group">
                <label htmlFor="name">
                  <span className="col-xs-4 control-label">{phrases.seasonForm.name} </span>
                  <div className="col-xs-8">
                    <input className="form-control" name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
                    {this.state.error
                    ? <div className="error-message">
                      <i className="fa fa-exclamation" aria-hidden="true" /> {phrases.errorMessages.missingSeasonName}
                    </div>
                    : ''}
                  </div>
                </label>
              </div>
              <div className="form-group">
                <div className="col-lg-4 col-lg-offset-8 text-right">
                  <button className="btn btn-primary" onClick={this.submit}>{phrases.seasonForm.create}</button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>);
  }
}

export default connect(store => ({
  loading: store.season.loading,
  message: store.season.message,
  error: store.season.error,
}))(SeasonForm);
