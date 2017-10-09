import React from "react";

export default class Stagebar extends React.Component {

  constructor(props) {
    super(props);
  }

  

  render() {
    const pagination = this.props.views.map((view, idx) => {
      return <li class={this.props.view === view
        ? "active"
        : ""} onClick={(e) => {
        e.preventDefault();
        this.props.setView(view)
      }} key={idx}>
        <a href="#">{view}</a>
      </li>
    })

    return (
      <div class="col-xs-12">
        <ul class="pagination pagination-lg">
          {pagination}
        </ul>
      </div>
    )
  }

}
