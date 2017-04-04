import React from "react";
import {connect} from "react-redux";
require("../../stylesheets/base.scss");

export default class Tournamentsettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            raceto: this.props.raceto,
            sizeoptions: [],
            size: this.props.cupSize
        };
        this.initCupSize = this.initCupSize.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    initCupSize() {
        var size = this.props.tournamentSize;
        var options = [];
        while (size > 4) {
            size = size / 2;
            options.push(
                <option key={size} value={size}>{size}</option>
            )
        }
        options.reverse();
        this.state.sizeoptions = options;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        var raceto = this.state.raceto;
        raceto = {...raceto, [name]:value};
        this.setState({raceto: raceto});
        this.props.setRaceTo(raceto);
    }

    handleSelectChange(event) {
      this.props.setCupSize(event.target.value);
    }

    render() {
        const type = this.props.tournamentType;
        this.initCupSize();
        if (type === 'League') {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Round-robin stage, race to</label><input className="numberfield" name="roundrobin" onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Double-elimination stage, race to</label><input className="numberfield" name="double" onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Single-elimination stage, race to</label><input className="numberfield" name="single"  onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Players in cup</label>
                              <select value={this.state.size} onChange={this.handleSelectChange}>
                                  {this.state.sizeoptions}
                              </select>
                        </div>
                    </div>
                </div>
            );
        } else if (type === 'DoubleWithCup') {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Double-elimination stage, race to</label><input className="numberfield" name="double" onChange={this.handleInputChange} type="number" min="1"/></div>
                        <div className="lunaux-margin-bottom">
                            <label>Single-elimination stage, race to</label><input className="numberfield" name="single" onChange={this.handleInputChange} type="number" min="1"/></div>
                        <div className="lunaux-margin-bottom">
                            <label>Players in cup</label>
                            <select value={this.props.cupSize} onChange={this.handleSelectChange}>
                                {this.state.sizeoptions}
                            </select>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Race to</label><input className="numberfield" name="single" type="number" onChange={this.handleInputChange} min="1"/></div>
                    </div>
                </div>
            );
        }
    }
}
