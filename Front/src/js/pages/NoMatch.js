import React from "react"
import phrases from "../../Phrases"
import Icons from "../components/Icons"

export default class NoMatch extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<div class="container">
    <Icons type="ERROR" size="40px" message={phrases.errorMessages.pageNotFound} />
  </div>
  )
  }

}
